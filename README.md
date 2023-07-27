Uses v10 of Discord API.

Uses [this](https://github.com/StrawHatHacker/SvelteKit-Skeleton) SvelteKit template.

### Hey, I don't understand anything, OAuth2 confuses me :(
This is why I am here. Let's take this step by step :)

#### First you have to do a few things
1. Create a `.env` file at the root of the directory.
1. Create an app on [discord.com/developers](https://discord.com/developers/applications).
1. On the OAuth2 settings tab, create a new Redirect URI with this value `http://localhost:3000/api/v1/user/auth`. This is our API endpoint in which we will authenticate the user.
1. Add `http://localhost:3000/api/v1/user/auth` to your `.env file` as a value to `DISCORD_REDIRECT_URI`.
1. Under the URL generator settings tab, click the `identify` scope and the `guilds` scope.
1. Add the generated URL to your `.env file` as a value to `PUBLIC_DISCORD_AUTH_URI`. This is the URL the user will be redirected to when they click the "discord" button.
1. Get the app's `client ID` and `client secret` in the OAuth2->General tab and add them to your `.env` file.

It should look something like this:
```
DISCORD_REDIRECT_URI=""
PUBLIC_DISCORD_AUTH_URI=""
DISCORD_OAUTH_CLIENT_ID=""
DISCORD_OAUTH_CLIENT_SECRET=""
```

*For production, generate a new `DISCORD_REDIRECT_URI` with your domain name instead of `localhost:3000` and follow the steps again.*

#### The authentication process
1. User clicks the `Login with Discord` button and they get redirected to `PUBLIC_DISCORD_AUTH_URI`.
2. Assuming they successfully authorized our app in the Discord website, they will be redirected to our `DISCORD_REDIRECT_URI`, which is just a SvelteKit endpoint. Discord will append a `code` query parameter that we can use to get user data from Discord's API.
3. In our endpoint we get the user data and the guilds they are in, then we create a new session in memory(with `sessionHandler`) and saving the user data in it. Creating a session will return us a random ID that will send back to the user as a cookie, just as we redirect them to `/dashboard`. That is so...
4. When a user navigates to a protected route(eg. the `dashboard` folder), they send the cookie(automatically), then the cookie gets parsed in `/src/hooks.ts`, and then authenticated in the `/src/routes/dashboard/__layout.svelte`.
5. And now, navigating to `localhost:3000/dashboard` should display the user's Discord ID.

#### Other
* Type `FullUser`, is the authenticated user's access token properties(`GrantData`) and user information properties(`UserData`), in one type.

### Contributions
Contributions welcome ♥

Just open a new pull request.
