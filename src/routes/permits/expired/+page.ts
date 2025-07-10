import type { PageLoad } from "./$types";
import { loadPermits } from "../load";

export const load: PageLoad = loadPermits("api/permits/expired");
