import type { Actions } from "./$types";
import { messageDecoder } from "$lib/models";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";

export const actions: Actions = {
  register: async (event) => {
    const data = await event.request.formData();

    const formVals = {
      residentID: data.get("residentID")?.toString(),
      firstName: data.get("firstName")?.toString(),
      lastName: data.get("lastName")?.toString(),
      phone: data.get("phone")?.toString(),
      email: data.get("email")?.toString(),
      password: data.get("password")?.toString(),
    };
    const confirmPassword = data.get("confirmPassword")?.toString();

    const fields = [
      ["residentID", formVals.residentID],
      ["firstName", formVals.firstName],
      ["lastName", formVals.lastName],
      ["phone", formVals.phone],
      ["email", formVals.email],
      ["password", formVals.password],
      ["confirmPassword", confirmPassword],
    ];
    const missing = fields.filter(([_, v]) => v === "" || v === undefined).map(([k, _]) => k);
    if (missing.length !== 0) {
      return invalid(400, { error: `Missing fields: ${missing.join(", ")}` });
    } else if (formVals.password !== confirmPassword) {
      return invalid(400, { error: "Passwords do not match" });
    }

    const result = await post(`api/account`, formVals, messageDecoder, "asd");
    if (!isOk(result)) {
      let response = "Unhandled error. Please file an issue with our team and try again later.";
      if (result.message.includes("Failed to fetch")) {
        response =
          "Couldn't connect to server. Please notify the administration or try again later.";
      } else if (result.message.includes("500")) {
        response = "Server error. Please file an issue with our team and try again later.";
      }
      return invalid(400, { error: response });
    }

    return { message: result.data.message };
  },
};
