import type { Result } from "$lib/functional";
import type { ListWithMetadata, Permit } from "$lib/models";

export type PermitLists = {
  all: Result<ListWithMetadata<Permit>>;
  active: Result<ListWithMetadata<Permit>>;
  expired: Result<ListWithMetadata<Permit>>;
  exceptions: Result<ListWithMetadata<Permit>>;
};
