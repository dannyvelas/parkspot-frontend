import type { Result } from '$lib/functional';
import type { Decoder } from 'decoders';
import { newOk, newErr } from '$lib/functional';

export const decodeAndCheckEmpty = <T>(decoder: Decoder<T>, obj: unknown): Result<T> => {
    const decodeRes = decoder.decode(obj);
    if (!decodeRes.ok) {
        return newErr("Program error, please notify the administration to fix this.")
    }

    const missing = Object.entries(decodeRes.value)
      .filter(([_, v]) => v === "")
      .map(([k, _]) => k);
    if (missing.length > 0) {
      return newErr(`Missing fields: ${missing.join(", ")}`);
    }

  return newOk(decodeRes.value)
}
