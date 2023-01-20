import type { Actions } from "./$types";
import * as decoders from "decoders";
import { messageDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { fail } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { Request } from "$lib/api";
import { getHeaderToken } from "$lib/server/auth";

const formDecoder = decoders.object({
  id: decoders.string,
  firstName: decoders.string,
  lastName: decoders.string,
  phone: decoders.string,
  email: decoders.string,
  password: decoders.string,
  confirmPassword: decoders.string,
});

export const actions: Actions = {
  register: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const formRes = validate(formDecoder, formObject);
    if (!isOk(formRes)) {
      return fail(400, { response: formRes.message });
    } else if (formRes.data.password !== formRes.data.confirmPassword) {
      return fail(400, { response: "Passwords do not match" });
    }

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return fail(400, { response: tokenRes.message });
    }

    const result = await new Request(`api/resident`, messageDecoder)
      .setAccessToken(tokenRes.data)
      .post(formRes.data);
    if (!isOk(result)) {
      if (result.message.includes("401")) {
        return fail(401, {
          response: "Error: your session has expired. Please log in again to create a permit.",
        });
      }
      return fail(400, { response: "Error: " + result.message });
    }

    return { response: result.data.message };
  },
};
