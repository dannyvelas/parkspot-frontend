import type { Result } from "$lib/functional";
import type { Message } from "$lib/models";
import type { Decoder } from "decoders";
import { isOk, newOk, newErr } from "$lib/functional";
import { messageDecoder } from "$lib/models";
type Method = "GET" | "DELETE" | "POST" | "PUT";

const HOSTNAME = import.meta.env.VITE_SERVER;

type FetchOpts = {
  method: Method;
  mode: "cors";
  headers?: Headers;
  body?: string;
  credentials: "include";
};

const getFetchOpts = <ReqBody>(method: Method, request?: ReqBody, accessToken?: string) => {
  const fetchOpts: FetchOpts = { method, mode: "cors", credentials: "include" };
  if (request) {
    fetchOpts.headers = new Headers({ "Content-Type": "application/json" });
    fetchOpts.body = JSON.stringify(request);
  }

  if (accessToken) {
    if (fetchOpts.headers) {
      fetchOpts.headers.append("Authorization", `Bearer ${accessToken}`);
    } else {
      fetchOpts.headers = new Headers({ Authorization: `Bearer ${accessToken}` });
    }
  }

  return fetchOpts;
};

const getResponse = async (path: string, fetchOpts: FetchOpts): Promise<Result<Response>> => {
  let response: Response;
  try {
    response = await fetch(`${HOSTNAME}/${path}`, fetchOpts);
  } catch (error) {
    if (error instanceof TypeError) {
      return newErr("Error getting response: " + error.message);
    } else {
      return newErr("Unhandled error getting response");
    }
  }

  return newOk(response);
};

const getJson = async (response: Response): Promise<Result<any>> => {
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
};

const decodeJson = <T>(json: any, responseDecoder: Decoder<T>): Result<T> => {
  try {
    const decodedResponse = responseDecoder.verify(json);
    return newOk(decodedResponse);
  } catch (error) {
    return newErr("Error decoding response: " + error);
  }
};

const sendReq = async <ReqBody, ResBody>(
  method: Method,
  path: string,
  params: Record<string, string>,
  request: ReqBody | undefined,
  responseDecoder: Decoder<ResBody>,
  accessToken?: string
): Promise<Result<ResBody>> => {
  const fetchOpts = getFetchOpts(method, request, accessToken);
  const paramStr = new URLSearchParams(params).toString();
  const response = await getResponse(`${path}?${paramStr}`, fetchOpts);
  if (!isOk(response)) {
    return newErr(response.message);
  }

  if (!response.data.ok) {
    // non-200 status code
    const statusText = `${response.data.status}: ${response.data.statusText}`;
    const responseText = await response.data.text();
    const fullError = responseText ? `${statusText}. ${responseText}` : statusText;
    return newErr(fullError);
  }

  const jsonResponse = await getJson(response.data);
  if (!isOk(jsonResponse)) {
    return newErr(jsonResponse.message);
  }

  const decodedResponse = decodeJson(jsonResponse.data, responseDecoder);
  if (!isOk(decodedResponse)) {
    return newErr(decodedResponse.message);
  }

  return newOk(decodedResponse.data);
};

export const get = <ResBody>(
  path: string,
  params: Record<string, string>,
  responseDecoder: Decoder<ResBody>,
  accessToken?: string
) => sendReq<undefined, ResBody>("GET", path, params, undefined, responseDecoder, accessToken);

export const del = async (path: string, accessToken?: string): Promise<Result<Message>> =>
  sendReq<undefined, Message>("DELETE", path, {}, undefined, messageDecoder, accessToken);

export const post = <ReqBody, ResBody>(
  path: string,
  request: ReqBody,
  responseDecoder: Decoder<ResBody>,
  accessToken?: string
) => sendReq<ReqBody, ResBody>("POST", path, {}, request, responseDecoder, accessToken);

export const put = <ReqBody, ResBody>(
  path: string,
  request: ReqBody,
  responseDecoder: Decoder<ResBody>,
  accessToken?: string
) => sendReq<ReqBody, ResBody>("PUT", path, {}, request, responseDecoder, accessToken);
