import { Profile } from "../../backend/data/types/Profile"

function url(t: { base: string, path?: string, query?: Record<string, string>[] }) {
    let e = ""
    if ((t.base && ((e += t.base), t.base.endsWith("/") || (e += "/")), t.path && (t.path.startsWith("/") ? (e += t.path.substring(1)) : (e += t.path), t.path.endsWith("/") && (e = e.substring(0, e.length - 1))), t.query)) {
        for (let s of ((e += "?"), t.query)) {
            let n = Object.entries(s)[0];
            "" !== n[1] && (e += n[0] + "=" + n[1] + "&");
        }
        e = e.substring(0, e.length - 1);
    }
    return e
}

const dataUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5100/" : "https://data.interknot.space"

export async function searchUsers(query: string) : Promise<Profile[]> {
    let response = await fetch(url({
        base: dataUrl,
        path: "profiles",
        query: [{ query }]
    }))
    if (response.status !== 200) return []

    return await response.json()
}

export async function getUser(uid: number) : Promise<Profile | undefined> {
    let response = await fetch(url({
        base: dataUrl,
        path: `profile/${uid}`
    }))
    if (response.status !== 200) return undefined

    return await response.json()
}

export async function devListAllUsers() : Promise<number[]> {
    let response = await fetch(url({
        base: dataUrl,
        path: "profiles",
        query: [{ listAll: "true" }]
    }))
    if (response.status !== 200) return []

    return await response.json()
}