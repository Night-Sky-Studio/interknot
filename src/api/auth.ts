import { type Account, type IResult, url } from "@interknot/types"
import { DATA_URL, req } from "./data"

export async function authenticateDiscord(code: string): Promise<IResult<Account>> {
    return await req(url({
        base: DATA_URL,
        path: "/auth/discord"
    }), false, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
    })
}

// "session" is a cookie
// `/auth` returns an account object
export async function authenticate(): Promise<IResult<Account>> {
    return await req(url({
        base: DATA_URL,
        path: "/auth"
    }), false, {
        method: "POST",
        credentials: "include" // session should be included
    })
}

export async function logout(): Promise<IResult<boolean>> {
    return await req(url({
        base: DATA_URL,
        path: "/auth/logout"
    }), false, {
        method: "POST",
        credentials: "include"
    })
}