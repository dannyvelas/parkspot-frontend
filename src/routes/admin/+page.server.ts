import type { Actions } from "./$types";
import * as decoders from "decoders";
import { messageDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";
import { getHeaderToken } from "$lib/auth";

const formDecoder = decoders.object({
  residentID: decoders.string,
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
      return invalid(400, { response: formRes.message });
    } else if (formRes.data.password !== formRes.data.confirmPassword) {
      return invalid(400, { response: "Passwords do not match" });
    }

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return invalid(400, { response: tokenRes.message });
    }

    const result = await post(`api/account`, formRes.data, messageDecoder, tokenRes.data);
    if (!isOk(result)) {
      if (result.message.includes("401")) {
        return invalid(400, {
          error: "Your session has expired. Please log in again to create a permit.",
        });
      }
      return invalid(400, { error: result.message });
    }

    return { response: result.data.message };
  },
};
