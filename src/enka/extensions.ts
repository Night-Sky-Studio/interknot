declare global {
    interface Object {
        toMap<K extends string, V>(this: Record<K, V>): Map<K, V>
    }
    interface Map<K, V> {
        map<T>(callback: (key: K, value: V) => T): T[]
        map<T>(callback: (key: K, value: V, index: number) => T): T[]
    }
}

Object.prototype.toMap = function <K extends string, V>(this: Record<K, V>): Map<K, V> {
    return new Map(Object.entries(this) as [K, V][])
}

Map.prototype.map = function <K, V, T>(
    callback: ((key: K, value: V) => T) | ((key: K, value: V, index: number) => T)
): T[] {
    let index = 0
    const result: T[] = []

    this.forEach((value, key) => {
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