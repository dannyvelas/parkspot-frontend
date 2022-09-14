import type { Actions } from "./$types";
import { object, string } from "decoders";
import { residentDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { put } from "$lib/api";
import { getHeaderToken } from "$lib/auth";

const formDecoder = object({
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const formRes = validate(formDecoder, formObject, true);
    if (!isOk(formRes)) {
      return invalid(400, { response: formRes.message });
    }

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return invalid(400, { response: '401: Unauthorized. "Unauthorized"' });
    }

    const putRes = await put(
      `api/resident/${event.params.id}`,
      formRes.data,
      residentDecoder,
      tokenRes.data
    );
    if (!isOk(putRes)) {
      if (putRes.message.includes("401")) {
        return invalid(400, {
          response:
            "Your session has expired. Please log out and log back in again to edit this resident.",
        });
      }
      return invalid(400, { response: putRes.message });
    }

    return { response: "Resident has been successfully updated" };
  },
};
