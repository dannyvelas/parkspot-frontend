import type { Load } from '@sveltejs/kit';
import type { Decoder } from 'decoders';
import type { Result } from '$lib/functional';
import { get } from '$lib/api';

type OutputProps<T> = {
	result: T;
};

export const getLoadFn = <T>(
	path: string,
	params: Record<string, string>,
	resourceDecoder: Decoder<T>
) => {
	const loadFn: Load<Record<string, string>, Record<string, any>, OutputProps<Result<T>>> = async ({
		session: { user },
		url
	}) => {
		if (!user) return { status: 302, redirect: '/' };

		const currPageNum = Number(url.searchParams.get('page')) || 1;
		params['page'] = `${currPageNum}`;

		const result = await get<T>(path, params, resourceDecoder);

		return {
			props: {
				result,
				currPageNum
			}
		};
	};

	return loadFn;
};
