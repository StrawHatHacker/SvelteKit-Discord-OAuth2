import { fetchSession } from '$lib/utils/sessionHandler';

interface IBody {
    sessionId: string;
}

export async function post({ request }) {

    const body: IBody = await request.json();
    if (!body.sessionId) return { status: 400, body: { error: 'Property "sessionId" is required.' } };

    const session = fetchSession(body.sessionId);
    if (!session) return { status: 400, body: { error: 'Invalid session.' } };

    return {
        status: 200,
        body: session
    };
}
