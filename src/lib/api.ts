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
	try {
		const response = await fetch(`${HOSTNAME}/${path}`, fetchOpts);
		return newOk(response);
	} catch (error) {
		if (error instanceof TypeError) {
			return newErr(error.message);
		} else {
			return newErr('Unhandled error connecting to server');
		}
	}
};

const getJson = async (response: Response): Promise<Result<any>> => {
	try {
		const jsonResponse = await response.json();
		return newOk(jsonResponse);
	} catch (error) {
		if (error instanceof SyntaxError) {
			return newErr(error.message);
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
		return newErr(decodedResponse.error.text);
	} else {
		return newErr('Unhandled error decoding response');
	}
};

const send =
	(method: Method) =>
	async <ReqBody, ResBody>(
		path: string,
		data: ReqBody,
		responseDecoder: Decoder<ResBody>
	): Promise<Result<ResBody>> => {
		const fetchOpts: FetchOpts = { method, credentials: 'include' };
		if (data) {
			fetchOpts.headers = new Headers({ 'Content-Type': 'application/json' });
			fetchOpts.body = JSON.stringify(data);
		}

		const response = await getResponse(path, fetchOpts);
		if (!isOk(response)) {
			return newErr(response.error);
		} else if (!response.data.ok) {
			const statusText = `${response.data.status}: ${response.data.statusText}`;
			let errorText = statusText;

			const responseText = await response.data.text();
			if (responseText) {
				errorText = `${errorText}. ${responseText}`;
			}

			return newErr(errorText);
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

export const get = <ResBody>(path: string, responseDecoder: Decoder<ResBody>) =>
	send('GET')<undefined, ResBody>(path, undefined, responseDecoder);
//export const del = <ResBody>(path: string, responseDecoder: Decoder<ResBody>) =>
//	send('DELETE')<undefined, ResBody>(path, responseDecoder, undefined);

export const post = send('POST');
export const put = send('PUT');
