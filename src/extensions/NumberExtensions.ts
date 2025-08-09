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