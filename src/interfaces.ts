export type Only<T, U> = { [P in keyof T]: T[P] } & { [P in Exclude<keyof U, keyof T>]?: never };
export type Either<T, U> = Only<T, U> | Only<U, T>;

export type TSessionID = string;
export type TAccessToken = string;
export type TUserDiscordID = string;

export interface Iresponse<T> {
	status: 200 | 400 | 500 | number;
	body: Either<T, { error: string }>;
}

export interface ITokenGrantData {
	access_token: TAccessToken;
	refresh_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
}

export interface IUserData {
	id: TUserDiscordID;
	username: string;
	avatar: string;
	avatar_decoration: unknown;
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: string;
	banner_color: string;
	accent_color: number;
	locale: string;
	mfa_enabled: boolean;
}

export type FullUser = ITokenGrantData & IUserData;

export interface IUserGuildData {
	id: string;
	name: string;
	icon: string;
	owner: boolean;
	permissions: string;
	features: string[];
}