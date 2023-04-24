import type { Actions } from "./$types";
import { sessionDecoder } from "$lib/auth";
import { newRefresh } from "$lib/server/auth";
import { fail } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { Request } from "$lib/api";
import { PUBLIC_ENV } from "$env/static/public";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());

    const result = await new Request(sessionDecoder).post("api/login", formObject);
    if (!isOk(result)) {
      let error = "Unhandled error. Please notify the administration or try again later.";
      if (result.message.includes("Unauthorized")) {
        error = "Wrong username or password. Please try again.";
      } else if (result.message.includes("Failed to fetch")) {
        error = "Couldn't connect to server. Please notify the administration or try again later.";
      } else if (result.message.includes("500")) {
        error = "Server error. Please notify the administration or try again later.";
      }
      return fail(400, { error });
    }

    // TODO: get refresh token from server and forward it, instead of creating our own
    const refreshToken = await newRefresh(result.data.user);
    event.cookies.set("refresh", refreshToken, {
      sameSite: "strict",
      secure: PUBLIC_ENV == "prod",
    });

    return { user: result.data.user, accessToken: result.data.accessToken };
    // success causes sveltekit to run invalidateAll() which causes +layout.server.ts to re-run
    // when it does, it will see the refresh cookie and initialize a session. the login page load
    // function will see this session and redirect the user to their dashboard
  },
};
