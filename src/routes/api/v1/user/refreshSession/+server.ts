import { error, json } from '@sveltejs/kit';
import { fetchSession, updateSession } from '$lib/utils/sessionHandler';
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
import type { APIUser } from 'discord-api-types/payloads/v10';
import type { RESTPostOAuth2AccessTokenResult} from 'discord-api-types/rest/v10';
import cookie from 'cookie';
import { DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ( { request} ) => {

    let cookies = cookie.parse(request.headers.get('cookie') || '')
    let sessionId = cookies['session_id'];
    if (!sessionId) throw error(400, 'Property "sessionId" is required');

    const session = fetchSession(sessionId);
    if (!session) throw error(400, 'Invalid session.');

    const FormData = new URLSearchParams({
        client_id: env.DISCORD_OAUTH_CLIENT_ID!,
        client_secret: DISCORD_OAUTH_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: session.refresh_token
    });

    try {
        // Get the authentication object using the user's code
        const AuthRes = await axios.post('https://discord.com/api/v10/oauth2/token', FormData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const GrantData : RESTPostOAuth2AccessTokenResult = AuthRes.data;

        // Get the user's data using the access token
        const UserRes = await axios.get(`https://discord.com/api/v10/users/@me`, {
            headers: {
                Authorization: `Bearer ${GrantData.access_token}`,
            }
        });

        const UserData: APIUser = UserRes.data;

        updateSession(sessionId, UserData, GrantData);

        // update the session cookie
        return(new Response('',{
            headers: {
                'Set-Cookie': cookie.serialize('session_id', sessionId as string, {
                    path: '/',
                    httpOnly: true,
                    sameSite: false,
                    secure: true,
                    maxAge: GrantData.expires_in
                }),
            }
        }));
    }
    catch (error) {
        log.error(error);
        return new Response(undefined, { status: 302 })
    }
}