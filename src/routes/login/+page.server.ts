import type { Actions } from "./$types";
import * as decoders from "decoders";
import { sessionDecoder, newRefresh } from "$lib/auth";
import { validate } from "$lib/form";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";

const formDecoder = decoders.object({
  id: decoders.string,
  password: decoders.string,
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const formRes = validate(formDecoder, formObject);
    if (!isOk(formRes)) {
      return invalid(400, { error: formRes.message });
    }

    const result = await post("api/login", formRes.data, sessionDecoder, "");
    if (!isOk(result)) {
      let error = "Unhandled error. Please notify the administration or try again later.";
      if (result.message.includes("Unauthorized")) {
        error = "Wrong username or password. Please try again.";
      } else if (result.message.includes("Failed to fetch")) {
        error = "Couldn't connect to server. Please notify the administration or try again later.";
      } else if (result.message.includes("500")) {
        error = "Server error. Please notify the administration or try again later.";
      }
      return invalid(400, { error });
    }

    // TODO: get refresh token from server and forward it, instead of creating our own
    const refreshToken = await newRefresh(result.data.user);
    event.cookies.set("refresh", refreshToken);

    return { user: result.data.user, accessToken: result.data.accessToken }; // success causes +layout.server.ts to re-run, thereby redirecting
  },
};
