import * as jose from 'jose';

export const expiringSoon = (token: string) => {
	try {
		const payload = jose.decodeJwt(token);
		if (!payload.exp) {
			return true;
		}

		const epochTimeNow = (() => {
			var d = new Date();
			return Math.round(d.getTime() / 1000);
		})();

		const secsToExpiry = payload.exp - epochTimeNow;
		const minsToExpiry = Math.round(secsToExpiry / 60);
		return minsToExpiry <= 5;
	} catch (err) {
		return true; // JWT invalid
	}
};
