import type { Actions } from "./$types";
import { object, string, either, constant, optional, iso8601 } from "decoders";
import { permitDecoder } from "$lib/models";
import { decodeAndCheckEmpty } from "$lib/form";
import { invalid, redirect } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";

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
    const permitRes = decodeAndCheckEmpty(formDecoder, formObject);
    if (!isOk(permitRes)) {
      return invalid(400, { error: permitRes.message });
    } else if (permitRes.data.isException === "true" && permitRes.data.exceptionReason === "") {
      return invalid(400, {
        error: "If this permit is an exception, please put a reason for the exception",
      });
    }

    // cast to form that backend requests
    const permitReq = {
      residentID: permitRes.data.residentID,
      car: {
        licensePlate: permitRes.data.licensePlate.toLocaleUpperCase(),
        color: permitRes.data.color,
        make: permitRes.data.make,
        model: permitRes.data.model,
      },
      startDate: permitRes.data.startDate,
      endDate: permitRes.data.endDate,
      exceptionReason: permitRes.data.exceptionReason || "",
    };

    const prefix = "Bearer ";
    const authHeader = event.request.headers.get("Authorization");
    const wellFormed = authHeader && authHeader.startsWith(prefix);
    const accessToken = wellFormed ? authHeader.slice(prefix.length) : "";
    if (!accessToken) {
      return invalid(400, { error: "Error: your session has expired." });
    }

    const result = await post("api/permit", permitReq, permitDecoder, accessToken);
    if (!isOk(result)) {
      if (result.message.includes("401")) {
        return invalid(400, {
          error: "Your session has expired. Please log in again to create a permit.",
        });
      }
      return invalid(400, { error: result.message });
    }

    throw redirect(302, `/permit/${result.data.id}`);
  },
};
