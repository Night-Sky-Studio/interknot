import { Account, url } from "@interknot/types"
import { dataUrl } from "./data"

export async function authenticateDiscord(code: string): Promise<Account> {
    const response = await fetch(url({
        base: dataUrl,
        path: "/auth/discord"
    }), {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code
        }),
    })

    if (response.status !== 200) {
        throw new Error(`${response.status}: ${await response.text()}`)
    }

    return await response.json()
}

// "session" is a cookie
// /auth returns an account object
export async function authenticate(): Promise<Account> {
    const response = await fetch(url({
        base: dataUrl,
        path: "/auth"
    }), {
        method: "POST",
        credentials: "include" // session should be included
    })

    if (response.status !== 200) {
        throw new Error(`${response.status}: ${await response.text()}`)
    }

    const json = await response.json()
    return json
}