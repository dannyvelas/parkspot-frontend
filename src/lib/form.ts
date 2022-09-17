import type { ActionResult } from "@sveltejs/kit";
import type { Result } from "$lib/functional";
import type { Decoder } from "decoders";
import { newOk, newErr } from "$lib/functional";
import { applyAction } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { tokenStore, expiringSoon } from "$lib/auth";
import { get } from "svelte/store";

export function validate<T>(
  decoder: Decoder<T>,
  obj: unknown,
  emptyOk: boolean = false
): Result<T> {
  const decodeRes = decoder.decode(obj);
  if (!decodeRes.ok) {
    return newErr("Program error, please notify the administration to fix this");
  }

  if (emptyOk) {
    return newOk(decodeRes.value);
  }

  const missing = Object.entries(decodeRes.value)
    .filter(([_, v]) => v === "")
    .map(([k, _]) => k);
  if (missing.length > 0) {
    return newErr(`Missing fields: ${missing.join(", ")}`);
  }

  return newOk(decodeRes.value);
}

type opts = {
  formData?: FormData; // optionally override default formdata
  resetForm?: boolean; // optionally reset form values after submit
};

export async function submitWithToken(form: HTMLFormElement, opts?: opts) {
  const justFormData = opts?.formData ?? new FormData(form);

  if (expiringSoon(get(tokenStore))) {
    await tokenStore.refresh();
  }

  const response = await fetch(form.action, {
    method: "POST",
    body: justFormData,
    headers: new Headers({ Authorization: `Bearer ${get(tokenStore)}` }),
  });
  const result: ActionResult = await response.json();

  if (result.type === "success") {
    await invalidateAll();
    if (opts?.resetForm === undefined || opts.resetForm === true) {
      form.reset();
    }
  }

  applyAction(result);
}
