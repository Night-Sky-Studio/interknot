import { getPropertyName } from "../mappers/PropertyMapper"
import { getLocalString } from "./Localization"

export enum PropertyType {
    Delta = 0,
    Ratio = 1,
    Decimal = 2
}

export class Property {
    public FormatType: PropertyType = PropertyType.Delta

    constructor(
        public readonly Id: number, 
        public BaseValue: number, 
        public readonly Level: number = 1
    ) {
        if (this.name.includes("Crit") || this.name.includes("Ratio")) {
            this.FormatType = 1
        } else if (this.name.includes("SpRec")) {
            this.FormatType = 2
        }
    }

    get Value(): number {
        return this.BaseValue * this.Level
    }

    set Value(other: number) {
        this.BaseValue = other
    }

    get formatted(): string {
        if (this.FormatType === 0) {
            return Math.floor(this.Value).toLocaleString()
        }
        if (this.FormatType === 1) {
            return (this.Value / 100).toFixed(1) + "%"
        }
        if (this.FormatType === 2) {
            return (Math.floor(this.Value) / 100).toFixed(2).replace(/0$/, "")
        }
        return this.Value.toLocaleString()
    }

    get name(): string {
        return getPropertyName(this.Id) ?? "Unknown"
    }

    get simpleName(): string {
        return this.name.replace(/_(b|B)ase|_(r|R)atio|_(d|D)elta/g, "")
    }

    get nameLocalized(): string {
        return getLocalString(this.name)
    }

    get simpleNameLocalized(): string {
        console.log("simpleNameLocalized", this.simpleName, getLocalString(this.simpleName))
        return getLocalString(this.simpleName)
    }

    addValue(other: number): Property {
        return new Property(this.Id, this.Value + other, this.Level)
    }

    subtract(other: Property): Property {
        return new Property(this.Id, this.Value - other.Value, this.Level)
    }
}