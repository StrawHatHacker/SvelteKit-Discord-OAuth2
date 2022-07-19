import { writable } from 'svelte/store';
import type { IUserData } from '../interfaces';

const fUser = function () {
    const { subscribe, set, update } = writable<IUserData>();

    return {
        subscribe,
        setUser: (u: IUserData) => set(u)
    }
}

export const UserStore = fUser();