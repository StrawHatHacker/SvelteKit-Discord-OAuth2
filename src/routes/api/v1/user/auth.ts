import type { ITokenGrantData, IUserData, IUserGuildData, TSessionID } from 'src/interfaces';
import { setSession } from '$lib/utils/sessionHandler';
import cookie from 'cookie';
import axios from 'axios';

export async function get({ url }) {
    const code = url.searchParams.get('code');
    if (!code) return { status: 400, body: { error: 'No code provided' } };

    const FormData = new URLSearchParams({
        client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
        client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    try {
        // Get the authentication object using the user's code
        const AuthRes = await axios.post('https://discord.com/api/v10/oauth2/token', FormData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const Grantdata: ITokenGrantData = AuthRes.data;

        // Get the user's data using the access token
        const UserRes = await axios.get(`https://discord.com/api/v10/users/@me`, {
            headers: {
                Authorization: `Bearer ${Grantdata.access_token}`,
            }
        });

        const UserData: IUserData = UserRes.data;

        // Get the guilds the user is in
        const UserGuildRes = await axios.get(`https://discord.com/api/v10/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${Grantdata.access_token}`,
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const UserGuildData: IUserGuildData[] = UserGuildRes.data;

        // Create new session for the user
        const SessionID: TSessionID = setSession(UserData, Grantdata);

        // Optionally, you can upsert the user in the DB here

        // Redirect the user and set the session cookie
        return {
            status: 302,
            headers: {
                'Set-Cookie': cookie.serialize('session_id', SessionID as string, {
                    path: '/',
                    httpOnly: true,
                    sameSite: false,
                    secure: true,
                    maxAge: Grantdata.expires_in
                }),
                Location: '/dashboard'
            }
        }

    } catch (error) {
        console.log(error);
        return {
            status: 302,
            Location: '/authorizationError'
        }
    };
}
