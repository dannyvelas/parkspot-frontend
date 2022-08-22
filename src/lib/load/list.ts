import type { Decoder } from "decoders";
import type { Result } from "$lib/functional";
import type { ListWithMetadata } from "$lib/models";
import { listWithMetadataDecoder } from "$lib/models";
import { get } from "$lib/api";

export type listConfig<T> = {
  endpoint: string;
  decoder: Decoder<T>;
  limit: number;
  reversed: boolean;
  page: number;
};

export async function loadList<T>(args: listConfig<T>): Promise<Result<ListWithMetadata<T>>> {
  const params = {
    reversed: `${args.reversed}`,
    limit: `${args.limit}`,
    page: `${args.page}`,
  };

  return await get(args.endpoint, params, listWithMetadataDecoder(args.decoder));
}
