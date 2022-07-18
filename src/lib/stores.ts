import { writable } from 'svelte/store';
import type { FullUser } from '../interfaces';

const fUser = function () {
    const { subscribe, set, update } = writable<FullUser>();

    return {
        subscribe,
        setUser: (u: FullUser) => set(u)
    }
}

export const UserStore = fUser();