import { Leaderboard, LeaderboardDistribution, LeaderboardEntry, LeaderboardProfile, PagedData, Profile, ProfileInfo, Property, url } from "@interknot/types"

export const dataUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5100/" : "https://data.interknot.space"

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

export async function getUser(uid: number, update: boolean = false) : Promise<Profile> {
    let response = await fetch(url({
        base: dataUrl,
        path: `profile/${uid}`,
        query: [{
            update: `${update}`
        }]
    }))
    if (response.status !== 200) 
        throw new Error(`${response.status}: ${await response.text()}`)

    const json = await response.json()

    return restoreProperties(json)
}

export async function getUserLeaderboards(uid: number, update: boolean = false): Promise<LeaderboardProfile> {
    const response = await fetch(url({
        base: dataUrl,
        path: `/leaderboards/${uid}`,
        query: [
            { "update": `${update}` }
        ]
    }))
    if (response.status !== 200) 
        throw new Error(`${response.status}: ${await response.text()}`)

    return restoreProperties(await response.json())
}

export async function getLeaderboards(): Promise<Leaderboard[]> {
    const response = await fetch(url({
        base: dataUrl,
        path: "/leaderboards"
    }))
    if (response.status !== 200) 
        throw new Error(`${response.status}: ${await response.text()}`)
    return await response.json()
}

export async function getLeaderboard(id: number): Promise<Leaderboard[]> {
    const response = await fetch(url({
        base: dataUrl,
        path: `/leaderboard/${id}`
    }))
    if (response.status !== 200)
        throw new Error(`${response.status}: ${await response.text()}`)
    return await response.json()
}

export async function getLeaderboardUsers(id: number, page: number = 1, limit: number = 10): Promise<PagedData<LeaderboardEntry>> {
    const response = await fetch(url({
        base: dataUrl,
        path: `/leaderboard/${id}/users`,
        query: [
            { page: `${page}` },
            { limit: `${limit}` }
        ]
    }))
    if (response.status !== 200)
        throw new Error(`${response.status}: ${await response.text()}`)
    return restoreProperties(await response.json())
}

export async function getLeaderboardDmgDistribution(id: number): Promise<LeaderboardDistribution> {
    const response = await fetch(url({
        base: dataUrl,
        path: `/leaderboard/${id}/distribution`
    }))
    if (response.status !== 200)
        throw new Error(`${response.status}: ${await response.text()}`)
    return restoreProperties(await response.json())
}

export async function pingDataServer() {
    const response = await fetch(url({
        base: dataUrl
    }))
    return response
}