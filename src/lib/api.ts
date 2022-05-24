import type { Result } from '$lib/functional';
import { isOk, newOk, newErr } from '$lib/functional';
import type { Decoder } from 'decoders';
type Method = 'GET' | 'DELETE' | 'POST' | 'PUT';

const HOSTNAME = import.meta.env.VITE_DEV_SERVER;

type FetchOpts = {
	method: Method;
	headers?: Headers;
	body?: string;
	credentials: 'include';
};

const getResponse = async (path: string, fetchOpts: FetchOpts): Promise<Result<Response>> => {
	let response;
	try {
		response = await fetch(`${HOSTNAME}/${path}`, fetchOpts);
	} catch (error) {
		if (error instanceof TypeError) {
			return newErr('Error getting response: ' + error.message);
		} else {
			return newErr('Unhandled error getting response');
		}
	}

	if (!response.ok) {
		const statusText = `${response.status}: ${response.statusText}`;
		let errorText = statusText;

		const responseText = await response.text();
		if (responseText) {
			errorText = `${errorText}. ${responseText}`;
		}

		return newErr(errorText);
	}

	return newOk(response);
};

const getJson = async (response: Response): Promise<Result<any>> => {
	try {
		const jsonResponse = await response.json();
		return newOk(jsonResponse);
	} catch (error) {
		if (error instanceof SyntaxError) {
			return newErr('Error parsing JSON: ' + error.message);
		} else {
			return newErr('Unhandled error parsing JSON');
		}
	}
};

const decodeJson = <T>(json: any, responseDecoder: Decoder<T>): Result<T> => {
	const decodedResponse = responseDecoder.decode(json);
	if (decodedResponse.ok) {
		return newOk(decodedResponse.value);
	} else if (decodedResponse.error.text !== undefined) {
		return newErr('Error decoding response: ' + decodedResponse.error.text);
	} else {
		return newErr('Unhandled error decoding response');
	}
};

const sendReq = async <ReqBody, ResBody>(
	method: Method,
	path: string,
	params: Record<string, string>,
	request: ReqBody,
	responseDecoder: Decoder<ResBody>
): Promise<Result<ResBody>> => {
	const fetchOpts: FetchOpts = { method, credentials: 'include' };
	if (request) {
		fetchOpts.headers = new Headers({ 'Content-Type': 'application/json' });
		fetchOpts.body = JSON.stringify(request);
	}

	const paramStr = new URLSearchParams(params).toString();
	const response = await getResponse(`${path}?${paramStr}`, fetchOpts);
	if (!isOk(response)) {
		return newErr(response.error);
	}

	const jsonResponse = await getJson(response.data);
	if (!isOk(jsonResponse)) {
		return newErr(jsonResponse.error);
	}

	const decodedResponse = decodeJson(jsonResponse.data, responseDecoder);
	if (!isOk(decodedResponse)) {
		return newErr(decodedResponse.error);
	}

	return newOk(decodedResponse.data);
};

export const get = <ResBody>(
	path: string,
	params: Record<string, string>,
	responseDecoder: Decoder<ResBody>
) => sendReq<undefined, ResBody>('GET', path, params, undefined, responseDecoder);

export const del = async (path: string): Promise<Result<{}>> => {
	const fetchOpts: FetchOpts = { method: 'DELETE', credentials: 'include' };

	const response = await getResponse(path, fetchOpts);
	if (!isOk(response)) {
		return newErr(response.error);
	}

	return newOk({});
};

export const post = <ReqBody, ResBody>(
	path: string,
	request: ReqBody,
	responseDecoder: Decoder<ResBody>
) => sendReq<ReqBody, ResBody>('POST', path, {}, request, responseDecoder);

export const put = <ReqBody, ResBody>(
	path: string,
	request: ReqBody,
	responseDecoder: Decoder<ResBody>
) => sendReq<ReqBody, ResBody>('PUT', path, {}, request, responseDecoder);
