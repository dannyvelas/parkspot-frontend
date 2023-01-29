import type { Result } from "$lib/functional";
import type { Decoder } from "decoders";
import { PUBLIC_BACKENDURL } from "$env/static/public";
import { isOk, newOk, newErr } from "$lib/functional";
type Method = "GET" | "DELETE" | "POST" | "PUT";

type FetchOpts = {
  method: Method;
  mode: "cors";
  headers: Headers;
  body?: string;
  credentials: "include";
};

export class Request<Req, Res> {
  private decoder?: Decoder<Res>;
  private params: Record<string, string> = {};
  private accessToken?: string;
  private headers: Array<[string, string]> = [];
  private method!: Method;
  private path!: string;
  private body?: Req;

  constructor(decoder?: Decoder<Res>) {
    this.decoder = decoder;
    return this;
  }

  addParams(params: Record<string, string>) {
    this.params = { ...this.params, ...params };
    return this;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    return this;
  }

  setHeaders(headers: Array<[string, string]>) {
    this.headers = headers;
    return this;
  }

  async get(path: string) {
    this.path = path;
    this.method = "GET";
    return this.send();
  }

  async delete(path: string) {
    this.path = path;
    this.method = "DELETE";

    let rawResponse = await this.getRawResponse();
    return !isOk(rawResponse) ? newErr(rawResponse.message) : newOk({ ok: true });
  }

  async post(path: string, body?: Req) {
    this.path = path;
    this.body = body;
    this.method = "POST";
    return this.send();
  }

  async put(path: string, body?: Req) {
    this.path = path;
    this.body = body;
    this.method = "PUT";
    return this.send();
  }

  private async send(): Promise<Result<Res>> {
    const rawResponse = await this.getRawResponse();
    if (!isOk(rawResponse)) {
      return newErr(rawResponse.message);
    }

    return this.parseResponse(rawResponse.data);
  }

  private async getRawResponse(): Promise<Result<Response>> {
    const fetchOpts = this.getFetchOpts();
    const paramStr = new URLSearchParams(this.params).toString();
    const pathAndParms = `${this.path}?${paramStr}`;

    let response: Response;
    try {
      response = await fetch(`${PUBLIC_BACKENDURL}/${pathAndParms}`, fetchOpts);
    } catch (error) {
      if (error instanceof TypeError) {
        return newErr("Error getting response: " + error.message);
      } else {
        return newErr("Unhandled error getting response");
      }
    }

    if (!response.ok) {
      // non-200 status code
      const statusText = `${response.status}: ${response.statusText}`;
      const responseText = await response.text();
      const fullError = responseText ? `${statusText}. ${responseText}` : statusText;
      return newErr(fullError);
    }

    return newOk(response);
  }

  private getFetchOpts() {
    const fetchOpts: FetchOpts = {
      method: this.method,
      mode: "cors",
      credentials: "include",
      headers: new Headers(),
    };
    if (this.body) {
      fetchOpts.headers.append("Content-Type", "application/json");
      fetchOpts.body = JSON.stringify(this.body);
    }

    if (this.accessToken) {
      fetchOpts.headers.append("Authorization", `Bearer ${this.accessToken}`);
    }

    const justHeaders = this.headers !== undefined ? this.headers : [];
    for (const [k, v] of justHeaders) {
      fetchOpts.headers.append(k, v);
    }

    return fetchOpts;
  }

  private async parseResponse(response: Response): Promise<Result<Res>> {
    const jsonResponse = await this.getJson(response);
    if (!isOk(jsonResponse)) {
      return newErr(jsonResponse.message);
    }

    const decodedResponse = this.decodeJson(jsonResponse.data);
    if (!isOk(decodedResponse)) {
      return newErr(decodedResponse.message);
    }

    return newOk(decodedResponse.data);
  }

  private async getJson(response: Response): Promise<Result<any>> {
    try {
      const jsonResponse = await response.json();
      return newOk(jsonResponse);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return newErr("Error parsing JSON: " + error.message);
      } else {
        return newErr("Unhandled error parsing JSON");
      }
    }
  }

  private decodeJson(json: any): Result<Res> {
    if (!this.decoder) {
      return newErr("developer error: decoder undefined");
    }

    try {
      const decodedResponse = this.decoder.verify(json);
      return newOk(decodedResponse);
    } catch (error) {
      return newErr("Error decoding response: " + error);
    }
  }
}
