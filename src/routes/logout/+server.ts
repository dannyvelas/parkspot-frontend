import { json } from "@sveltejs/kit";

export function POST() {
  return json(
    { message: "Successfully logged-out user" },
    {
      headers: {
        "set-cookie":
          "refresh=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly",
      },
    }
  );
}
