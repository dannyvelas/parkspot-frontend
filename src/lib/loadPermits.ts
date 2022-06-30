import type { Load } from '@sveltejs/kit';
import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
import { get } from '$lib/api';

export const getLoadFn = (endpoint: string, limit: number, reversed: boolean): Load => {
	const load: Load = async (loadInput) => {
		const currPageNum = Number(loadInput.url.searchParams.get('page')) || 1;
		const params = {
			reversed: `${reversed}`,
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get(endpoint, params, listWithMetadataDecoder(permitDecoder));

		return {
			props: {
				result,
				currPageNum
			}
		};
	};

	return load;
};
