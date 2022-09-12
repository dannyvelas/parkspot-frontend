import type { Actions } from "./$types";
import { object, string } from "decoders";
import { carDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { put } from "$lib/api";
import { getHeaderToken } from "$lib/auth";

const formDecoder = object({
  color: string,
  make: string,
  model: string,
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const formRes = validate(formDecoder, formObject, true);
    if (!isOk(formRes)) {
      return invalid(400, { response: formRes.message });
    }

    const accessToken = getHeaderToken(event.request.headers);
    if (!accessToken) {
      return invalid(400, { response: '401: Unauthorized. "Unauthorized"' });
    }

    const putRes = await put(`api/car/${event.params.id}`, formRes.data, carDecoder, accessToken);
    if (!isOk(putRes)) {
      if (putRes.message.includes("401")) {
        return invalid(400, {
          response:
            "Your session has expired. Please log out and log back in again to edit this car.",
        });
      }
      return invalid(400, { response: putRes.message });
    }

    return { response: "Car has been successfully updated" };
  },
};
