import type { PageLoad } from "./$types";
import { loadResidents } from "../load";

export const load: PageLoad = loadResidents("api/residents", true);
