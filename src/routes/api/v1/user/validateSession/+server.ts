import { fetchSession } from '$lib/utils/sessionHandler';
import type { APIUser } from 'discord-api-types/v10';
import cookie from 'cookie';

interface IBody {
    sessionId: string;
}

export async function POST({ request }) {
    let cookies = cookie.parse(request.headers.get('cookie') || '')
    let sessionId = cookies['session_id'];
    if (!sessionId) return { status: 400, body: { error: 'Property "sessionId" is required.' } };

    const session = fetchSession(sessionId);
    if (!session) return { status: 400, body: { error: 'Invalid session.' } };

    const {...apiUser}:APIUser = session;

    return {
        status: 200,
        body: apiUser
    };
}
