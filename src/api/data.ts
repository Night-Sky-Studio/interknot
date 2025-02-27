import { Profile, Property } from "@interknot/types"

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

// This should restore Property classes that's lost 
// when converting from json
function restoreProperties(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(restoreProperties) // Recursively process arrays
    } else if (obj && typeof obj === "object") {
        if ("Id" in obj && "BaseValue" in obj && "Level" in obj) {
            return new Property(obj.Id, obj.BaseValue, obj.Level)
        }
        // Recursively check properties of objects
        for (const key of Object.keys(obj)) {
            obj[key] = restoreProperties(obj[key])
        }
    }
    return obj
}

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

    const json = await response.json()

    return restoreProperties(json)
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