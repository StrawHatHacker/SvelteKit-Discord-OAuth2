import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import type { FullUser, TSessionID } from 'src/interfaces';
import crypto from 'node:crypto';

const sessionUsers = new Map<TSessionID, FullUser>();

export function setSession(userData: APIUser, tokenGrantData: RESTPostOAuth2AccessTokenResult) {

    // Creating a new session ID that will be used as a cookie to authenticate the user in 
    const newSessionID: TSessionID = crypto.randomBytes(32).toString('hex');
    const fullUser: FullUser = { ...userData, ...tokenGrantData };

    sessionUsers.set(newSessionID, fullUser);

    setTimeout(() => {
        deleteSession(newSessionID)
    }, 1000 * 60 * 10) //  10 minutes

    return newSessionID as TSessionID;
}

export function fetchSession(sessionId: TSessionID) {
    return sessionUsers.get(sessionId) || null;
}

export function deleteSession(sessionId: TSessionID) {
    sessionUsers.delete(sessionId);
}
