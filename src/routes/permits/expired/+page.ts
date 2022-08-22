import type { PageLoad } from "./$types";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { loadPermits } from "../load";

export const load: PageLoad = loadPermits("api/permits/expired", MAX_AMT_PER_PAGE);
