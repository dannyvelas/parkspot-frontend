import type { RequestHandler } from "./$types";
import { PUBLIC_ENV, PUBLIC_COOKIEDOMAIN } from "$env/static/public";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = (event) => {
  event.cookies.delete("refresh", {
    expires: new Date(0),
    secure: PUBLIC_ENV == "prod",
    domain: PUBLIC_COOKIEDOMAIN,
  });
  return json({ message: "Successfully logged-out user" });
};
