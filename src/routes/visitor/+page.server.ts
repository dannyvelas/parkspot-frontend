import type { Actions } from "./$types";
import { object, string, either, constant, optional, iso8601 } from "decoders";
import { visitorDecoder } from "$lib/models";
import { validate } from "$lib/form";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";
import { getHeaderToken } from "$lib/auth";

const formDecoder = object({
  firstName: string,
  lastName: string,
  relationship: either(constant("fam/fri"), constant("contractor")),
  accessStart: iso8601,
  accessEnd: iso8601,
  isForever: optional(constant("true")),
});

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const formRes = validate(formDecoder, formObject);
    if (!isOk(formRes)) {
      return invalid(400, { response: formRes.message });
    }

    const tokenRes = getHeaderToken(event.request.headers);
    if (!isOk(tokenRes)) {
      return invalid(400, { response: tokenRes.message });
    }

    const isForeverBool = formRes.data.isForever === "true";
    const payload = { ...formRes.data, isForever: isForeverBool };

    const result = await post("api/visitor", payload, visitorDecoder, tokenRes.data);
    if (!isOk(result)) {
      if (result.message.includes("401")) {
        return invalid(400, {
          response: "Your session has expired. Please log in again to create a visitor.",
        });
      }
      return invalid(400, { response: result.message });
    }

    return { response: "Visitor has been successfully created" };
  },
};
