import { userDecoder } from '$lib/models';
import { isOk } from '$lib/functional';
import { get } from '$lib/api';

export const hydrateSession = async (session: App.Session): Promise<App.Session> => {
	if (session.user) {
		return session;
	}

	const getRes = await get('api/me', {}, userDecoder);
	if (!isOk(getRes)) {
		return session;
	}

	return {
		...session,
		user: getRes.data
	};
};
