import { userDecoder } from '$lib/models';
import { isOk } from '$lib/functional';
import { get } from '$lib/api';

export const getSession = async (): Promise<App.Session> => {
	const getRes = await get('api/me', {}, userDecoder);
	if (!isOk(getRes)) {
		return {};
	}

	return {
		user: getRes.data
	};
};
