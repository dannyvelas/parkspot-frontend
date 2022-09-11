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
    const passwordsRes = validate(formDecoder, formObject);
    if (!isOk(passwordsRes)) {
      return invalid(400, { response: passwordsRes.message });
    } else if (passwordsRes.data.password !== passwordsRes.data.confirmPassword) {
      return invalid(400, { response: "Error: passwords do not match" });
    }

    const accessToken = getHeaderToken(event.request.headers);
    if (!accessToken) {
      return invalid(400, { response: '401: Unauthorized. "Unauthorized"' });
    }

    const putRes = await put(
      `api/account/password`,
      passwordsRes.data,
      messageDecoder,
      accessToken
    );
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
