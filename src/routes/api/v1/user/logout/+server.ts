import { deleteSession } from '$lib/utils/sessionHandler';
import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';

export const POST: RequestHandler = async ( { request} ) => {
    const cookies = cookie.parse(request.headers.get('cookie') || '');

    if (cookies['session_id']) deleteSession(cookies['session_id']);

    return(new Response('', {
        headers: {
            'Set-Cookie': cookie.serialize('session_id', '', {
                path: '/',
                httpOnly: true,
                sameSite: false,
                secure: true,
                maxAge: 0
            })
        }
    }));
}