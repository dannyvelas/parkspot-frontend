import type { Actions } from './$types';
import { object, string } from 'decoders';
import { carDecoder } from '$lib/models';
import { validate } from '$lib/form';
import { fail } from '@sveltejs/kit';
import { isOk } from '$lib/functional';
import { put } from '$lib/api';
import { getHeaderToken } from '$lib/server/auth';

const formDecoder = object({
	color: string,
	make: string,
	model: string
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const formObject = Object.fromEntries(formData.entries());
		const formRes = validate(formDecoder, formObject, true);
		if (!isOk(formRes)) {
			return fail(400, { response: formRes.message });
		}

		const tokenRes = getHeaderToken(event.request.headers);
		if (!isOk(tokenRes)) {
			return fail(400, { response: tokenRes.message });
		}

		const putRes = await put(`api/car/${event.params.id}`, formRes.data, carDecoder, tokenRes.data);
		if (!isOk(putRes)) {
			if (putRes.message.includes('401')) {
				return fail(400, {
					response:
						'Your session has expired. Please log out and log back in again to edit this car.'
				});
			}
			return fail(400, { response: putRes.message });
		}

		return { response: 'Car has been successfully updated' };
	}
};
