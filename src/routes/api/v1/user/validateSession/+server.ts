import { json } from '@sveltejs/kit';
import { fetchSession } from '$lib/utils/sessionHandler';
import type { APIUser } from 'discord-api-types/v10';
import cookie from 'cookie';

interface IBody {
    sessionId: string;
}

export async function POST({ request }) {
    let cookies = cookie.parse(request.headers.get('cookie') || '')
    let sessionId = cookies['session_id'];
    if (!sessionId) return json({ error: 'Property "sessionId" is required.' }, {
        status: 400
    });

    const session = fetchSession(sessionId);
    if (!session) return json({ error: 'Invalid session.' }, {
        status: 400
    });

    const {...apiUser}:APIUser = session;

    return json(apiUser);
}
