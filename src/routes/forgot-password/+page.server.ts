import type { Actions } from "./$types";
import { messageDecoder } from "$lib/models";
import { invalid } from "@sveltejs/kit";
import { isOk } from "$lib/functional";
import { post } from "$lib/api";

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const id = data.get("id")?.toString();

    const fields = [["id", id]];
    const missing = fields.filter(([_, v]) => v === "" || v === undefined).map(([k, _]) => k);
    if (missing.length !== 0) {
      return invalid(400, { error: `Missing fields: ${missing.join(", ")}` });
    }

    const postRes = await post(`api/password-reset-email`, { id }, messageDecoder);
    if (!isOk(postRes)) {
      return invalid(400, { error: postRes.message });
    }

    return postRes.data;
  },
};
