import { fetchSession } from '$lib/utils/sessionHandler';
import type { Handle, GetSession } from '@sveltejs/kit';
import cookie from 'cookie';
import dotenv from 'dotenv';

dotenv.config();

export const handle: Handle | unknown = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	if (cookies['session_id']) {
		const session = fetchSession(cookies['session_id']);

		if (session) {
			event.locals.session = { id: cookies['session_id'] };
			return await resolve(event);
		}
	}

	event.locals.session = null;
	return await resolve(event);
};

export const getSession: GetSession | unknown = (request) => {
	if (request?.locals?.session) return request.locals.session;

	return {};
};
