let token = $state("");

export function getToken() {
  return token;
}

export function setToken(t: string) {
  token = t;
}
