declare global {
    interface Number {
        toFixedCeil(decimals: number): string
    }
}

Number.prototype.toFixedCeil = function (decimals: number): string {
    const factor = 10 ** decimals
    const result = Number(this) >= 0
        ? Math.ceil(Number(this) * factor) / factor
        : Math.floor(Number(this) * factor) / factor
    return result.toFixed(decimals)
}

export {}

export function toFixedCeil(num: number, decimals: number): string {
    const factor = 10 ** decimals
    const result = num >= 0
        ? Math.ceil(num * factor) / factor
        : Math.floor(num * factor) / factor
    return result.toFixed(decimals)
}