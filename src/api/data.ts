import { AgentAction, BaseLeaderboardEntry, BelleMessage, Build, DriveDisc, FinalStats, ICursoredResult, IResult, Leaderboard, LeaderboardDistribution, LeaderboardEntry, LeaderboardList, ProfileInfo, Property, url } from "@interknot/types"

interface IFilter {
    label: string
    img?: string
    column: string
    value: string
}

export interface BackendState {
    params: {
        status: string
        title: string
        message: string
        update_enabled: boolean
        update_disabled_msg: string
        search_enabled: boolean
    },
    filters: Record<string, IFilter[]>
    version: string
    uptime: number
    currentDate: string
}
export interface BackendError {
    message: string
    code?: number
}

const dataUrl = process.env.NODE_ENV === "development" 
    ? "http://127.0.0.1:5100/" 
    : process.env.NODE_ENV === "preview" 
        ? "https://data-preview.interknot.space"
        : "https://data.interknot.space"

// This should restore Property classes that's lost 
// when converting from json
export function restoreProperties(obj: any): any {
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

async function get<T>(u: string, restoreProps: boolean = false): Promise<IResult<T>> {
    console.log(u)
    let response = await fetch(u)
    let result = await response.json() as IResult<T>
    if (response.status !== 200) {
        throw new Error(result.message)
    } 
    if (restoreProps && result.data) {
        result.data = restoreProperties(result.data)
    }
    if (result.data === undefined) {
        throw new Error("No data in response")
    }
    return result
}

async function getCursored<T>(u: string, restoreProps: boolean = false): Promise<ICursoredResult<T>> {
    console.log(u)
    let response = await fetch(u)
    let result = await response.json() as ICursoredResult<T>
    if (response.status !== 200) {
        throw new Error(result.message)
    }
    if (restoreProps && result.data) {
        result.data = result.data.map(restoreProperties)
    }
    if (result.data === undefined) {
        throw new Error("No data in response")
    }
    return result
}

export async function searchUsers(query: string) : Promise<IResult<ProfileInfo[]>> {
    return await get(url({
        base: dataUrl,
        path: "profile/search",
        query: { query }
    }))
}

export async function getProfile(uid: number, update: boolean = false): Promise<IResult<ProfileInfo>> {
    return await get(url({
        base: dataUrl,
        path: `profile/${uid}`,
        query: { update: `${update}` }
    }))
}

export interface IQueryParams {
    uid?: number
    cursor?: string
    limit?: number
    filter?: Record<string, string>
    sort?: string
}

export async function getCharacters({ uid, cursor, limit, filter }: IQueryParams): Promise<ICursoredResult<Build>> {
    return await getCursored(url({
        base: dataUrl,
        path: "characters",
        query: {
            uid: uid?.toString(),
            cursor,
            limit: limit?.toString(),
            ...filter
        }
    }), true)
}
export async function getCharactersCount({ uid, hash }: { uid?: number, hash?: string }): Promise<IResult<number>> {
    return await get(url({
        base: dataUrl,
        path: "characters/count",
        query: {
            uid: uid?.toString(),
            hash
        }
    }))
}

export async function getDriveDiscs({ uid, cursor, limit, filter }: IQueryParams): Promise<ICursoredResult<DriveDisc>> {
    return await getCursored(url({
        base: dataUrl,
        path: "discs",
        query: {
            uid: uid?.toString(),
            cursor,
            limit: limit?.toString(),
            ...filter
        }
    }), true)
}

export async function getDriveDiscsCount({ uid, hash }: { uid?: number, hash?: string }): Promise<IResult<number>> {
    return await get(url({
        base: dataUrl,
        path: "discs/count",
        query: {
            uid: uid?.toString(),
            hash
        }
    }))
}

export async function getUserLeaderboards(uid: number, update: boolean = false): Promise<IResult<Omit<BaseLeaderboardEntry, "RotationValue">[]>> {
    return await get(url({
        base: dataUrl,
        path: `leaderboards/${uid}`,
        query: { update: `${update}` }
    }), true)
}

export async function getUserCharacterLeaderboards(uid: number, characterId: number): Promise<IResult<BaseLeaderboardEntry[]>> {
    return await get(url({
        base: dataUrl,
        path: `leaderboards/${uid}/character/${characterId}`
    }), true)
}

export async function getLeaderboards({ filter }: IQueryParams, expand: boolean = false): Promise<IResult<LeaderboardList[]>> {
    return await get(url({
        base: dataUrl,
        path: "leaderboards",
        query: {
            ...filter,
            expand: expand ? "true" : "false"
        }
    }), true)
}

export async function getLeaderboard(id: number): Promise<IResult<Leaderboard[]>> {
    return await get(url({
        base: dataUrl,
        path: `/leaderboard/${id}`
    }), true)
}

export async function getLeaderboardUsers(leaderboardId: number, {
    cursor,
    limit = 20,
    filter
}: IQueryParams): Promise<ICursoredResult<Omit<LeaderboardEntry, "Leaderboard">>> {
    return await getCursored(url({
        base: dataUrl,
        path: `/leaderboard/${leaderboardId}/users`,
        query: {
            cursor,
            limit: limit?.toString(),
            ...filter
        }
    }), true)
}

export async function getLeaderboardDmgDistribution(id: number): Promise<IResult<LeaderboardDistribution>> {
    return await get(url({
        base: dataUrl,
        path: `/leaderboard/${id}/distribution`
    }))
}

export interface CalcResponse {
    FinalStats: FinalStats
    PerAction: AgentAction[]
    Total: number
}

export async function getCalc(uid: number, characterId: number): Promise<IResult<CalcResponse>> {
    return await get(url({
        base: dataUrl,
        path: `/calc`,
        query: {
            uid: uid.toString(),
            characterId: characterId.toString()
        }
    }), true)
}

export async function getStatus(): Promise<BackendState> {
    let response: Response

    try {
        response = await fetch(url({
            base: dataUrl,
            path: "/status"
        }))
    } catch (e: any) {
        throw new Error(JSON.stringify({
            code: 520,
            message: e.message
        } satisfies BackendError))
    }

    if (response.status !== 200)
        throw new Error(JSON.stringify({
            code: response.status,
            message: await response.text()
        } satisfies BackendError))

    return response.json()
}

export async function getNews(): Promise<BelleMessage[]> {
    const response = await fetch(url({
        base: dataUrl,
        path: "/news"
    }))
    if (response.status !== 200)
        throw new Error(`${response.status}: ${await response.text()}`)
    return await response.json()
}