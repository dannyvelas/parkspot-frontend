import type { Load } from '@sveltejs/kit';
import type { Decoder } from 'decoders';
import type { Result } from '$lib/functional';
import { get } from '$lib/api';

type OutputProps<T> = {
	result: T;
};

export const getLoadFn = <T>(route: string, resourceDecoder: Decoder<T>) => {
	const loadFn: Load<Record<string, string>, Record<string, any>, OutputProps<Result<T>>> = async ({
		session: { user }
	}) => {
		if (!user) return { status: 302, redirect: '/' };

		const result = await get<T>(route, resourceDecoder);

		return {
			props: {
				result
			}
		};
	};

	return loadFn;
};
