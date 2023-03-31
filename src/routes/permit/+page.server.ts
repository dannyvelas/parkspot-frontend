import type { Actions } from "./$types";
import { getHeaderToken } from "$lib/server/auth";
import { isOk } from "$lib/functional";
import { error } from "@sveltejs/kit";
import { permitDecoder } from "$lib/models";
import { Request } from "$lib/api";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return error(401, { message: tokenRes.message });
    }

    const result = await new Request(permitDecoder)
      .setAccessToken(tokenRes.data)
      .post("api/permit", formObject);
    if (!isOk(result)) {
      return error(400, { message: result.message });
    }

    return { result };
  },
};
