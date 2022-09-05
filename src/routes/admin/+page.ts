import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ parent }) => {
  console.log('LOADING ADMIN PAGE')
  const parentData = await parent();
  console.log('PARENT DATA.USER:')
  console.log(parentData)
  console.log('END PARENT DATA.USER')
  if (!parentData.user) {
    throw redirect(307, "/login");
  }

  return {};
};
