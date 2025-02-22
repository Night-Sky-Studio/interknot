export interface Property {
    Id: number
    Name: string
    Format: string
}

export interface IValueProperty extends Property {
    Value: number
}

interface IDriveDiskProperty extends IValueProperty {
    Level: number
}

export class ValueProperty implements IValueProperty {
    constructor(
        public Id: number,
        public Name: string,
        public Format: string,
        public Value: number
    ) { }

    static fromProp(
        prop: Property,
        value: number
    ) {
        return new ValueProperty(prop.Id, prop.Name, prop.Format, value)
    }

    static format(format?: string, prop?: any, includePercentageSign: boolean = false): string {
        if (!format || !prop) return String(prop)
        return format.replace(/\{(\d+)(?::([^}]+))?\}/g, (_, index, pattern) => {
            if (index !== "0") return prop.toString() // Only support {0:pattern} for now.
            
            let num = Number(prop)
            if (isNaN(num)) return String(prop) // If not a number, return as a string.
    
            if (!pattern) {
                return String(prop) // If no pattern, return value as-is.
            }
    
            // Handle percentage formats correctly
            if (pattern.includes("%")) {
                const decimalPlaces = (pattern.split(".")[1] || "").length // Count decimals after '.'
                num = num / 100 // Divide by 100 to match C# behavior
                return num.toFixed(decimalPlaces).replace(/\.?0$/, "") + (includePercentageSign ? "%" : "")
            }
    
            // Handle decimal places
            const match = pattern.match(/^0\.#*$/)
            if (match) {
                const decimalPlaces = (match[0].split(".")[1] || "").length
                return num.toFixed(decimalPlaces).replace(/\.?0+$/, "") // Remove trailing zeros.
            }
    
            return String(prop)
        })
    }

    toString(includePercentageSign: boolean = false): string {
        return ValueProperty.format(this.Format, this.Value, includePercentageSign)
    }
}

export class DriveDiskProperty extends ValueProperty implements IDriveDiskProperty {
    constructor(
        public Id: number,
        public Name: string,
        public Format: string,
        public Value: number,
        public Level: number
    ) { 
        super(Id, Name, Format, Value) 
    }

    static fromProp(prop: ValueProperty, level: number): DriveDiskProperty {
        return new DriveDiskProperty(prop.Id, prop.Name, prop.Format, prop.Value, level)
    }
}