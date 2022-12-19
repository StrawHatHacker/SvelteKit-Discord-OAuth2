import { deleteSession } from '$lib/server/sessionHandler';
import cookie from 'cookie';

export async function POST({ request }) {
    
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    if (cookies['session_id']) deleteSession(cookies['session_id']);

    return new Response('', {
        status: 200,
        headers: {
            'Set-Cookie': cookie.serialize('session_id', null, {
                path: '/',
                httpOnly: true,
                sameSite: false,
                secure: true,
                maxAge: 0
            })
        }
    });
}
