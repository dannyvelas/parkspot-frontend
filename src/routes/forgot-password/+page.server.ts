import type { Actions } from "./$types";
import { messageDecoder } from "$lib/models";
import { fail } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { Request } from "$lib/api";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const formObject = Object.fromEntries(formData.entries());

    const postRes = await new Request(messageDecoder).post(`api/password-reset-email`, {
      id: formObject.id,
    });
    if (!isOk(postRes)) {
      return fail(400, { response: postRes.message });
    }

    return { response: postRes.data.message };
  },
};
