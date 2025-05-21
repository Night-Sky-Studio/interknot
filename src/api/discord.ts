import { url } from "@interknot/types"

export const DISCORD_CLIENT_ID = "1374748450205208646"
export const DISCORD_SCOPE = ["identify", "email", "guilds"]
export const DiscordRedirectUri = url({
    base: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://interknot.space",
    path: "/auth/discord/callback"
})

export function getDiscordAuthUrl() {
    return url({
        base: "https://discord.com",
        path: "/oauth2/authorize",
        query: [
            { client_id: DISCORD_CLIENT_ID },
            { redirect_uri: encodeURIComponent(DiscordRedirectUri) },
            { response_type: "code" },
            { scope: DISCORD_SCOPE.join("+") }
        ]
    })
}