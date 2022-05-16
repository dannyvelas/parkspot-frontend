import type { Load } from '@sveltejs/kit';
import type { Permit, ListWithMetadata } from '$lib/models';
import { permitDecoder, listWithMetadataDecoder } from '$lib/models';
import { get } from '$lib/api';

export const permitLoad = (route: string): Load => {
	const loadFn: Load = async ({ session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const result = await get<ListWithMetadata<Permit>>(
			route,
			listWithMetadataDecoder(permitDecoder)
		);

		return {
			props: {
				result
			}
		};
	};

	return loadFn;
};
