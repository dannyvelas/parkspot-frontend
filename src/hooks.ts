import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { userDecoder } from '$lib/models';
import { isOk, newErr, newOk } from '$lib/functional';
import { TokenExpiredError } from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { Result } from '$lib/functional';
import type { Handle, GetSession } from '@sveltejs/kit';

const TOKEN_SECRET = import.meta.env.VITE_TOKEN_SECRET;

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (!cookies.jwt) {
		return await resolve(event);
	}

	const verifiedJWT = verifyJWT(cookies.jwt);
	if (!isOk(verifiedJWT)) {
		return await resolve(event);
	}

	const decodedJWT = userDecoder.decode(verifiedJWT.data.user);
	if (!decodedJWT.ok) {
		return await resolve(event);
	}

	event.locals.user = decodedJWT.value;

	return await resolve(event);
};

export const getSession: GetSession = (event) => {
	return {
		user: event.locals && event.locals.user
	};
};

const verifyJWT = (token: string): Result<{ user: string }> => {
	let verifiedJWT: string | JwtPayload;
	try {
		verifiedJWT = jwt.verify(token, TOKEN_SECRET);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return newErr('JWT expired');
		} else {
			return newErr('Unhandled JWT verify error');
		}
	}

	if (typeof verifiedJWT === 'string') {
		return newErr('JWT was string');
	} else if (!('user' in verifiedJWT)) {
		return newErr("JWT did not have 'user' field");
	}

	return newOk({ user: verifiedJWT.user });
};
