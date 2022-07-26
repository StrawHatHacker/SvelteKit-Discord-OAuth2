import { fetchSession } from '$lib/utils/sessionHandler';
import type { APIUser } from 'discord-api-types/v10';

interface IBody {
    sessionId: string;
}

export async function POST({ request }) {

    const body: IBody = await request.json();
    if (!body.sessionId) return { status: 400, body: { error: 'Property "sessionId" is required.' } };

    const session = fetchSession(body.sessionId);
    if (!session) return { status: 400, body: { error: 'Invalid session.' } };

    delete session.access_token;
    delete session.refresh_token;
    delete session.expires_in;
    delete session.scope;
    delete session.token_type;

    return {
        status: 200,
        body: session as APIUser
    };
}
