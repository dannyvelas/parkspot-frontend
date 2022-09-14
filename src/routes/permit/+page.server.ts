import type { Actions } from "./$types";
import { object, string, either, constant, optional, iso8601 } from "decoders";
import { permitDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { invalid, redirect } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";
import { getHeaderToken } from "$lib/auth";

const formDecoder = object({
  residentID: string,
  licensePlate: string,
  color: string,
  make: string,
  model: string,
  startDate: iso8601,
  endDate: iso8601,
  isException: optional(either(constant("true"), constant("false"))),
  exceptionReason: optional(string),
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    console.log(formObject);
    const formRes = validate(formDecoder, formObject);
    if (!isOk(formRes)) {
      return invalid(400, { error: formRes.message });
    }

    // cast to form that backend requests
    const permitReq = {
      residentID: formRes.data.residentID,
      car: {
        licensePlate: formRes.data.licensePlate.toLocaleUpperCase(),
        color: formRes.data.color,
        make: formRes.data.make,
        model: formRes.data.model,
      },
      startDate: formRes.data.startDate,
      endDate: formRes.data.endDate,
      exceptionReason: formRes.data.exceptionReason || "",
    };

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return invalid(401, { response: tokenRes.message });
    }

    const result = await post("api/permit", permitReq, permitDecoder, tokenRes.data);
    if (!isOk(result)) {
      if (result.message.includes("401")) {
        return invalid(401, {
          error:
            "Your session has expired. Please log out and log back in again to create a permit.",
        });
      }
      return invalid(400, { error: result.message });
    }

    throw redirect(302, `/permit/${result.data.id}`);
  },
};
