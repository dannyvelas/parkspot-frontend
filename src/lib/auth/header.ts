import { newErr, newOk } from "$lib/functional";

const TOKEN_PREFIX = "Bearer ";
const HEADER_NAME = "Authorization";

export const getHeaderToken = (headers: Headers) => {
  const authHeader = headers.get(HEADER_NAME);
  if (!authHeader || !authHeader.startsWith(TOKEN_PREFIX)) {
    return newErr("Program error: missing headers");
  }

  return newOk(authHeader.slice(TOKEN_PREFIX.length));
};
