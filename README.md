Uses v10 of Discord API.

Uses [this](https://github.com/StrawHatHacker/SvelteKit-Skeleton) SvelteKit template.

### Hey, I don't understand anything, OAuth2 confuses me :(
This is why I am here. Let's take this step by step :)

#### First you have to do a few things
1. Create an app on [discord.com/developers](https://discord.com/developers/applications).
2. On the OAuth2 settings tab, create a new Redirect URI with this value `http://localhost:3000/api/v1/user/auth`. This is our API endpoint in which we will authenticate the user.
3. Under the URL generator settings tab, click the `identify` scope and the `guilds` scope.
4. Add the generated URL in the `Login with Discord` button's click event.
5. Get the app's `client ID` and `client secret` in the OAuth2 settings tab and...
6. Create a `.env` file in the root of the directory and add the following lines, adding the values from step 2 and step 5 between the `""`.
```
DISCORD_REDIRECT_URI=""
DISCORD_OAUTH_CLIENT_ID=""
DISCORD_OAUTH_CLIENT_SECRET=""
```

In production change the `localhost:3000` with your domain on [discord.com/developers](https://discord.com/developers/applications) AND generate a new authorization URL.

#### The authentication process
1. User clicks the `Login with Discord` button and they get redirected to the generated URL.
2. Assuming they authorized our app in the Discord website, they will be redirected to out Redirect URI, which is our endpoint(`http://localhost:3000/api/v1/user/auth` in this case). Discord will append a `code` query parameter that we can use to get user data from Discord's API.
3. In our endpoint we get the user data and the guilds they are in, then we create a new session in memory(with `sessionHandler`) and saving our `FullUser` in it. Creating a session will return us a random ID that will send back to the user as a cookie, just as we redirect them to `/dashboard`. That is so...
4. When a user navigates to a protected route(eg. the `dashboard` folder), they send the cookie(automatically), then the cookie gets parsed in `/src/hooks.ts`, and then authenticated in the `/src/routes/dashboard/__layout.svelte`.
5. In the layout's script tag, we add the `FullUser` to a store so they can be easily accessed by other components.
6. And now, navigating to `localhost:3000/dashboard` should display the user's Discord ID.

`FullUser` is the aggregated result of the authenticated user's access token data(`GrantData`) and user information data(`UserData`).