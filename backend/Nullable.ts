export type Nullable<T> = T | null | undefined

export function isNullOrUndefined<T>(value: T): boolean {
    return value === null || value === undefined
}