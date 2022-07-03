import type { Load } from '@sveltejs/kit';
import type { Decoder } from 'decoders';
import { listWithMetadataDecoder } from '$lib/models';
import { dashboard } from '$lib/navigation';
import { get } from '$lib/api';

export default function loadList<T>(
	endpoint: string,
	decoder: Decoder<T>,
	limit: number,
	reversed: boolean,
	roleNeeded: string
): Load {
	const load: Load = async (loadInput) => {
		if (!loadInput.session.user) {
			return { status: 302, redirect: '/' };
		} else if (loadInput.session.user.role !== roleNeeded) {
			return { status: 302, redirect: dashboard(loadInput.session.user) };
		}

		const currPageNum = Number(loadInput.url.searchParams.get('page')) || 1;
		const params = {
			reversed: `${reversed}`,
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get(endpoint, params, listWithMetadataDecoder(decoder));

		return {
			props: {
				result,
				currPageNum
			}
		};
	};

	return load;
}
