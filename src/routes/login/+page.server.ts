import type { Actions } from "./$types";
import { sessionDecoder, newRefresh } from "$lib/auth";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const id = data.get("id")?.toString();
    const password = data.get("password")?.toString();

    const fields = [
      ["id", id],
      ["password", password],
    ];
    const missing = fields.filter(([_, v]) => v === "" || v === undefined).map(([k, _]) => k);
    if (missing.length !== 0) {
      return invalid(400, { missing });
    }

    const result = await post("api/login", { id, password }, sessionDecoder);
    if (!isOk(result)) {
      let response = "Unhandled error. Please notify the administration or try again later.";
      if (result.message.includes("Unauthorized")) {
        response = "Wrong username or password. Please try again.";
      } else if (result.message.includes("Failed to fetch")) {
        response =
          "Couldn't connect to server. Please notify the administration or try again later.";
      } else if (result.message.includes("500")) {
        response = "Server error. Please notify the administration or try again later.";
      }
      return invalid(400, { response });
    }

    const refreshToken = await newRefresh(result.data.user);
    event.cookies.set("refresh", refreshToken);

    return { user: result.data.user, accessToken: result.data.accessToken };
  },
};
