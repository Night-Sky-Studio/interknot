import { getLocalString } from "./Localization"
import property from "./source/property.json"

const RawProps = property as Record<string, Record<string, string>>

interface Property {
    Id: string
    Name: string
    Format: string
}

export function formatProperty(format: string | null | undefined, value: any): string {
    if (!format) {
        return String(value) // Return value as-is if no format is provided.
    }

    return format.replace(/\{(\d+)(?::([^}]+))?\}/g, (_, index, pattern) => {
        if (index !== "0") return value // Only support {0:pattern} for now.

        let num = Number(value)
        if (isNaN(num)) return String(value) // If not a number, return as a string.

        if (!pattern) {
            return String(value) // If no pattern, return value as-is.
        }

        // Handle percentage formats correctly
        if (pattern.includes("%")) {
            const decimalPlaces = (pattern.split(".")[1] || "").length // Count decimals after '.'
            num = num / 100 // Divide by 100 to match C# behavior
            return num.toFixed(decimalPlaces).replace(/\.?0+$/, "") + "%"
        }

        // Handle decimal places
        const match = pattern.match(/^0\.#*$/)
        if (match) {
            const decimalPlaces = (match[0].split(".")[1] || "").length
            return num.toFixed(decimalPlaces).replace(/\.?0+$/, "") // Remove trailing zeros.
        }

        return String(value)
    })
}

function mapProperty(id: string, prop: Record<string, string>): Property {
    return {
        Id: id,
        Name: getLocalString(prop["Name"]),
        Format: prop["Format"]
    }
}

export default function getProperty(id: string): Property {
    return mapProperty(id, RawProps[id])
}