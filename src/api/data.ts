import { Profile, ProfileInfo, Property, url } from "@interknot/types"

const dataUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5100/" : "https://data.interknot.space"

// This should restore Property classes that's lost 
// when converting from json
function restoreProperties(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(restoreProperties) // Recursively process arrays
    } else if (obj && typeof obj === "object") {
        if ("Id" in obj && "BaseValue" in obj && "Level" in obj) {
            return new Property(obj.Id, obj.Name, obj.BaseValue, obj.Level)
        }
        // Recursively check properties of objects
        for (const key of Object.keys(obj)) {
            obj[key] = restoreProperties(obj[key])
        }
    }
    return obj
}

export async function searchUsers(query: string) : Promise<ProfileInfo[]> {
    let response = await fetch(url({
        base: dataUrl,
        path: "profiles",
        query: [{ query }]
    }))
    if (response.status !== 200) return []

    return await response.json()
}

export async function getUser(uid: number, update: boolean = false) : Promise<Profile | undefined> {
    let response = await fetch(url({
        base: dataUrl,
        path: `profile/${uid}`,
        query: [{
            update: `${update}`
        }]
    }))
    if (response.status !== 200) return undefined

    const json = await response.json()

    return restoreProperties(json)
}

export async function pingDataServer() {
    const response = await fetch(url({
        base: dataUrl
    }))
    return response
}