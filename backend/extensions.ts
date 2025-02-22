export const recordToMap = function <K extends string, V>(r: Record<K, V>): Map<K, V> {
    return new Map(Object.entries(r) as [K, V][])
}

export const map = function <K, V, T>(
    m: Map<K, V>,
    callback: ((key: K, value: V) => T) | ((key: K, value: V, index: number) => T)
): T[] {
    let index = 0
    const result: T[] = []

    m.forEach((value, key) => {
        if (callback.length === 2) {
            // Call the function without index
            result.push((callback as (key: K, value: V) => T)(key, value))
        } else {
            // Call the function with index
            result.push((callback as (key: K, value: V, index: number) => T)(key, value, index))
        }
        index++
    })

    return result
}