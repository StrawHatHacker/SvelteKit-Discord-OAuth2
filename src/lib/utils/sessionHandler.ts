import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import type { FullUser, TSessionID } from 'src/interfaces';
import crypto from 'crypto';

const sessionUsers = new Map<TSessionID, FullUser>();
const sessionUserTimeouts = new Map<TSessionID, NodeJS.Timeout>();

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

export function fetchClientSession(sessionId: TSessionID) {
    refreshTimeout(sessionId);

    const user = sessionUsers.get(sessionId);
    if (!user) return null;

    const {...partialUser} :APIUser = user;
    return partialUser;
}

export function fetchSession(sessionId: TSessionID) {
    refreshTimeout(sessionId);
    return sessionUsers.get(sessionId);
}

function refreshTimeout(sessionId: string) {
    if (sessionUserTimeouts.has(sessionId)) {
        sessionUserTimeouts.get(sessionId)?.refresh();
    }
    else {
        const timeout = setTimeout(() => {
            deleteSession(sessionId);
        }, 1000 * 60 * 10); //  10 minutes
        sessionUserTimeouts.set(sessionId, timeout);
    }
}

export function deleteSession(sessionId: TSessionID) {
    sessionUsers.delete(sessionId);
}

export function updateSession(sessionId: TSessionID, userData: APIUser, tokenGrantData: RESTPostOAuth2AccessTokenResult) {
    refreshTimeout(sessionId);
    const fullUser: FullUser = { ...userData, ...tokenGrantData };
    sessionUsers.set(sessionId, fullUser);

    return sessionId as TSessionID;
}