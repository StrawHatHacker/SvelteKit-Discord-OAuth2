import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import type { FullUser } from 'src/interfaces';
import crypto from 'node:crypto';

const sessionUsers = new Map<string, FullUser>();

export function setSession(userData: APIUser, tokenGrantData: RESTPostOAuth2AccessTokenResult) {

    // Creating a new session ID that will be used as a cookie to authenticate the user in 
    const newSessionID = crypto.randomBytes(32).toString('hex');
    const fullUser: FullUser = { ...userData, ...tokenGrantData };

    sessionUsers.set(newSessionID, fullUser);

    setTimeout(() => {
        deleteSession(newSessionID)
    }, 1000 * 60 * 10) //  10 minutes

    return newSessionID;
}

export function fetchSession(sessionId: string) {
    const s = sessionUsers.get(sessionId);

    if (s) {
        delete s.access_token;
        delete s.refresh_token;
        delete s.expires_in;
        delete s.scope;
        delete s.token_type;

        return s as APIUser;
    }

    return null;
}

export function deleteSession(sessionId: string) {
    sessionUsers.delete(sessionId);
}
