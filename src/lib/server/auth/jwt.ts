import type { User } from '$lib/models';
import { TOKEN_REFRESHSECRET } from '$env/static/private';
import * as jose from 'jose';

export const newRefresh = async (user: User) => {
	return await new jose.SignJWT({ user })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(Buffer.from(TOKEN_REFRESHSECRET));
};
