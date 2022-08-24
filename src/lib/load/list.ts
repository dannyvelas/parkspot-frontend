import type { Decoder } from "decoders";
import type { Result } from "$lib/functional";
import type { ListWithMetadata } from "$lib/models";
import { listWithMetadataDecoder } from "$lib/models";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { get } from "$lib/api";

export type listConfig<T> = {
  endpoint: string;
  decoder: Decoder<T>;
  reversed: boolean;
  page: number;
};

export async function loadList<T>(args: listConfig<T>): Promise<Result<ListWithMetadata<T>>> {
  const params = {
    reversed: `${args.reversed}`,
    limit: `${MAX_AMT_PER_PAGE}`,
    page: `${args.page}`,
  };

  return await get(args.endpoint, params, listWithMetadataDecoder(args.decoder));
}
