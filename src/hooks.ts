import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { userDecoder } from '$lib/models';
import type { Handle, GetSession } from '@sveltejs/kit';

const TOKEN_SECRET = import.meta.env.VITE_TOKEN_SECRET;

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (!cookies.jwt) {
		return await resolve(event);
	}

	const verifiedJWT = jwt.verify(cookies.jwt, TOKEN_SECRET);
	if (typeof verifiedJWT === 'string') {
		return await resolve(event);
	} else if (!verifiedJWT.user) {
		return await resolve(event);
	}

	const decodedJWT = userDecoder.decode(verifiedJWT.user);
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
