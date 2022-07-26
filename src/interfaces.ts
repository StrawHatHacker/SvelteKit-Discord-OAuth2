import type { APIUser, RESTPostOAuth2AccessTokenResult, Snowflake } from 'discord-api-types/v10';

export type Only<T, U> = { [P in keyof T]: T[P] } & { [P in Exclude<keyof U, keyof T>]?: never };
export type Either<T, U> = Only<T, U> | Only<U, T>;

export type TSessionID = string;

export interface Iresponse<T> {
	status: 200 | 400 | 500 | number;
	body: Either<T, { error: string }>;
}

export type FullUser = APIUser & RESTPostOAuth2AccessTokenResult;

export interface IPartialGuild {
	id: Snowflake;
	name: string;
	icon: string;
	owner: boolean;
	permissions: string;
	features: string[];
}
