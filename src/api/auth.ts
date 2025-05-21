import { url } from "@interknot/types"
import { dataUrl } from "./data"

export default async function authenticateDiscord(code: string) {
    const response = await fetch(url({
        base: dataUrl,
        path: "/auth/discord",
        query: [
            { code }
        ]
    }))
    if (response.status !== 200) {
        throw new Error(`${response.status}: ${await response.text()}`)
    }
    const json = await response.json()
    return json
}