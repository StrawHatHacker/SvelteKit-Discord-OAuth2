import type { APIUser } from 'discord-api-types/v10';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (!locals?.user) throw error(401);    

    return locals.user as APIUser;
    
}) satisfies PageServerLoad;
