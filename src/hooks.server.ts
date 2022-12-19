import { fetchSession } from '$lib/server/sessionHandler';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	
	const sessionID = event.cookies.get('session_id');
	event.locals.user = fetchSession(sessionID);
	
	if (event.url.pathname.startsWith('/protected')) {
		if (!event.locals.user) throw redirect(303, '/');
	}

	return await resolve(event);
}) satisfies Handle;
