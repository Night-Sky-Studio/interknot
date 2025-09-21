import { SetStateAction } from "react"
import { useSearchParams } from "react-router"

type QueryValue = string | string[] | undefined
type QueryParams = Record<string, QueryValue>

export function useQueryParams(): [
    QueryParams, 
    (action: SetStateAction<QueryParams>, replace?: boolean) => void
] {
    const [searchParams, setSearchParams] = useSearchParams()

    // Convert URLSearchParams -> object
    const params: QueryParams = {}
    for (const [key, value] of searchParams.entries()) {
        if (params[key] !== undefined) {
            // already exists -> make it an array
            const prev = params[key]
            params[key] = Array.isArray(prev) 
                ? [...prev, value] 
                : [prev as string, value]
        } else {
            params[key] = value
        }
    }

    // Update function
    const updateParams = (action: SetStateAction<QueryParams>, replace?: boolean) => {
        replace = replace ?? false

        const nextParams =
            typeof action === "function" ? action(params) : action

        const next = new URLSearchParams(searchParams)

        if (replace) {
            next.forEach((_, key) => next.delete(key))
        }

        Object.entries(nextParams).forEach(([key, value]) => {
            if (value === undefined) {
                next.delete(key)
            } else if (Array.isArray(value)) {
                next.delete(key)
            value.forEach((v) => next.append(key, v))
            } else {
                next.set(key, value)
            }
        })

        setSearchParams(next)
    }


    return [params, updateParams]
}
