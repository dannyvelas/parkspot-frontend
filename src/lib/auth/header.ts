const TOKEN_PREFIX = "Bearer ";
const HEADER_NAME = "Authorization";

export const getHeaderToken = (headers: Headers) => {
  const authHeader = headers.get(HEADER_NAME);
  const wellFormed = authHeader && authHeader.startsWith(TOKEN_PREFIX);
  return wellFormed ? authHeader.slice(TOKEN_PREFIX.length) : "";
};
