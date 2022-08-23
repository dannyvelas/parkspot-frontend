import type { PageLoad } from "./$types";
import { DEFAULT_AMT_PER_PAGE } from "$lib/constants";
import { loadPermits } from "../load";

export const load: PageLoad = loadPermits("api/permits", DEFAULT_AMT_PER_PAGE, true);
