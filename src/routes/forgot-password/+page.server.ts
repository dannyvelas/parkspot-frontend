import type { Actions } from "./$types";
import { messageDecoder } from "$lib/models";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());
    if (!formObject.hasOwnProperty("id")) {
      return invalid(400, {
        response: "Program error, please notify the administration to fix this.",
      });
    } else if (!formObject.id) {
      return invalid(400, { response: "Missing fields: id" });
    }

    const postRes = await post(`api/password-reset-email`, { id: formObject.id }, messageDecoder);
    if (!isOk(postRes)) {
      return invalid(400, { response: postRes.message });
    }

    return { response: postRes.data.message };
  },
};
