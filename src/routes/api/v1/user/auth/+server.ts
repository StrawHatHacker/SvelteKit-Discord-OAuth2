import { DISCORD_REDIRECT_URI, DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { setSession } from '$lib/server/sessionHandler';
import type { TPartialGuild } from 'src/interfaces';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import cookie from 'cookie';
import axios from 'axios';

export const GET: RequestHandler = async ({ url }) => {
    const code = url.searchParams.get('code');
    if (!code) return json({ error: 'No code provided' }, {
        status: 400
    });

    const FormData = new URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENT_ID,
        client_secret: DISCORD_OAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: DISCORD_REDIRECT_URI,
    });

    try {
        // Get the authentication object using the user's code
        const AuthRes = await axios.post('https://discord.com/api/v10/oauth2/token', FormData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const AccessData: RESTPostOAuth2AccessTokenResult = AuthRes.data;

        // Get the user's data using the access token
        const UserRes = await axios.get(`https://discord.com/api/v10/users/@me`, {
            headers: {
                Authorization: `Bearer ${AccessData.access_token}`,
            }
        });

        const UserData: APIUser = UserRes.data;

        // Get the guilds the user is in
        const UserGuildRes = await axios.get(`https://discord.com/api/v10/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${AccessData.access_token}`,
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const UserGuildData: TPartialGuild[] = UserGuildRes.data;

        // Create new session for the user
        const SessionID = setSession(UserData, AccessData);

        // Optionally, you can upsert the user in the DB here

        // Redirect the user and set the session cookie
        return new Response('', {
            status: 307,
            headers: {
                'Set-Cookie': cookie.serialize('session_id', SessionID as string, {
                    path: '/',
                    httpOnly: true,
                    sameSite: false,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: AccessData.expires_in
                }),
                Location: '/protected'
            }
        })

    } catch (error) {
        console.log(error);
        return new Response(undefined, { status: 307 })
    };
}
