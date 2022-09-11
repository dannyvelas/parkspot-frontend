import type { Actions } from "./$types";
import * as decoders from "decoders";
import { messageDecoder } from "$lib/models";
import { decodeAndCheckEmpty } from "$lib/form";
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
    const residentRes = decodeAndCheckEmpty(formDecoder, formObject);
    if (!isOk(residentRes)) {
      return invalid(400, { response: residentRes.message });
    } else if (residentRes.data.password !== residentRes.data.confirmPassword) {
      return invalid(400, { response: "Passwords do not match" });
    }

    const accessToken = getHeaderToken(event.request.headers);
    if (!accessToken) {
      return invalid(400, { response: '401: Unauthorized. "Unauthorized"' });
    }

    const result = await post(`api/account`, residentRes.data, messageDecoder, accessToken);
    if (!isOk(result)) {
      const response = result.message.includes("Failed to fetch")
        ? "Couldn't connect to server. Please notify the administration or try again later."
        : result.message.includes("500")
        ? "Server error. Please file an issue with our team and try again later."
        : result.message;
      return invalid(400, { response });
    }

    return { response: result.data.message };
  },
};
