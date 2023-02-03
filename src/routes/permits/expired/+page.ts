import type { PageLoad } from "../all/$types";
import { loadPermits } from "../load";

export const load: PageLoad = loadPermits("api/permits/expired");
