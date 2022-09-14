import type { Actions } from "./$types";
import { object, string } from "decoders";
import { messageDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { put } from "$lib/api";
import { getHeaderToken } from "$lib/auth";

const formDecoder = object({
  password: string,
  confirmPassword: string,
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const formRes = validate(formDecoder, formObject);
    if (!isOk(formRes)) {
      return invalid(400, { response: formRes.message });
    } else if (formRes.data.password !== formRes.data.confirmPassword) {
      return invalid(400, { response: "Error: passwords do not match" });
    }

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return invalid(400, { response: tokenRes.message });
    }

    const putRes = await put(`api/account/password`, formRes.data, messageDecoder, tokenRes.data);
    if (!isOk(putRes)) {
      return invalid(400, {
        response:
          "Error: it seems like this link has expired. Please go back to the forgot password" +
          " page for a new reset password email.",
      });
    }

    return { response: putRes.data.message };
  },
};
