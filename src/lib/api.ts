import type { Result } from '$lib/functional';
import { newOk, newErr } from '$lib/functional';
type Method = 'GET' | 'DELETE' | 'POST' | 'PUT';

type FetchOpts = {
	method: Method;
	headers?: Headers;
	body?: string;
};

const send =
	(method: Method) =>
	async <ReqBody, ResBody>(path: string, data: ReqBody): Promise<Result<ResBody>> => {
		const opts: FetchOpts = { method };
		if (data) {
			opts.headers = new Headers({ 'Content-Type': 'application/json' });
			opts.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(`http://localhost:5000/${path}`, opts);
			if (response.ok) {
				try {
					const jsonResponse = await response.json();
					return newOk(jsonResponse);
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

export const get = <ResBody>(path: string) => send('GET')<undefined, ResBody>(path, undefined);
export const del = <ResBody>(path: string) => send('DELETE')<undefined, ResBody>(path, undefined);
export const post = send('POST');
export const put = send('PUT');
