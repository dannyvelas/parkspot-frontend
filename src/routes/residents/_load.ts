import type { Load } from '@sveltejs/kit';
import { listWithMetadataDecoder, residentDecoder } from '$lib/models';
import { get } from '$lib/api';

export const getLoadFn = (endpoint: string, limit: number, reversed: boolean): Load => {
	const load: Load = async (loadInput) => {
		if (!loadInput.session.user) return { status: 302, redirect: '/' };

		const currPageNum = Number(loadInput.url.searchParams.get('page')) || 1;
		const params = {
			reversed: `${reversed}`,
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get(endpoint, params, listWithMetadataDecoder(residentDecoder));

		return {
			props: {
				result,
				currPageNum
			}
		};
	};

	return load;
};
