import type { Result } from '$lib/functional';
import { newOk, newErr } from '$lib/functional';
import type { Decoder } from 'decoders';
type Method = 'GET' | 'DELETE' | 'POST' | 'PUT';

type FetchOpts = {
	method: Method;
	headers?: Headers;
	body?: string;
	credentials: 'include';
};

const send =
	(method: Method) =>
	async <ReqBody, ResBody>(
		path: string,
		data: ReqBody,
		responseDecoder: Decoder<ResBody>
	): Promise<Result<ResBody>> => {
		const opts: FetchOpts = { method, credentials: 'include' };
		if (data) {
			opts.headers = new Headers({ 'Content-Type': 'application/json' });
			opts.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(`http://localhost:5000/${path}`, opts);
			if (response.ok) {
				try {
					const jsonResponse = await response.json();
					const decodedResponse = responseDecoder.verify(jsonResponse);
					return newOk(decodedResponse);
				} catch (error) {
					return newErr(`Error parsing json: ${error}`);
				}
			} else {
				return newErr(await response.text());
			}
		} catch (error) {
			return newErr(`Error sending request: ${error}`);
		}
	};

export const get = <ResBody>(path: string, responseDecoder: Decoder<ResBody>) =>
	send('GET')<undefined, ResBody>(path, undefined, responseDecoder);
//export const del = <ResBody>(path: string, responseDecoder: Decoder<ResBody>) =>
//	send('DELETE')<undefined, ResBody>(path, responseDecoder, undefined);

export const post = send('POST');
export const put = send('PUT');
