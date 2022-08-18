import { fetchSession } from '$lib/utils/sessionHandler';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
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