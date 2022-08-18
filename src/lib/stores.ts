import { writable } from 'svelte/store';
import type { APIUser } from 'discord-api-types/payloads/v10';

const fUser = function () {
    const { subscribe, set, update } = writable<APIUser>();

    return {
        subscribe,
        setUser: (u: APIUser) => set(u)
    }
}

export const UserStore = fUser();