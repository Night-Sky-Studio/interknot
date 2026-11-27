import { getErrorString } from "@/localization/Localization"

/**
 * An error returned by the backend, carrying its `E_*` status code so callers
 * can branch on the status instead of matching on the message.
 */
export class ApiError extends Error {
    readonly status?: string
    /** Message as reported by the backend, without the localized status prefix. */
    readonly detail: string

    constructor(status: string | undefined, detail: string) {
        super(`${getErrorString(status)} :: ${detail}`)
        this.name = "ApiError"
        this.status = status
        this.detail = detail
    }
}

/** Message to show to the user for anything thrown by the api layer. */
export function errorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.detail
    if (error instanceof Error) return error.message
    return `${error}`
}
