import type { PropertyList } from "../../api/EnkaResponse"
import property from "../raw/property.json"
import { Property } from "../types/Property"

type RawProperty = {
    Name: string
    Format: string
}

const Properties = property as Record<string, RawProperty>

export const valuePropertyMapper = (id: string, val: number) => mapValueProperty(parseInt(id), val)

export function getPropertyName(id: number): string {
    return Properties[id].Name
}

export function mapValueProperty(id: number, value: number): Property {
    return new Property(id, value)
}

export function mapDriveDiskProperty(prop: PropertyList): Property {
    return new Property(prop.PropertyId, prop.PropertyValue, prop.PropertyLevel)
}

export function getBaseElementId(elements: string[]): number {
    const ElementsMap: Record<string, number[]> = {
        "Physics": [31501, 31503, 31505], // Elements.Physics
        "Fire": [31601, 31603, 31605], // Elements.Fire
        "Ice": [31701, 31703, 31705], // Elements.Ice    
        "Elec": [31801, 31803, 31805], // Elements.Elec
        "Ether": [31901, 31903, 31905], // Elements.Ether
    }

    for (let element of elements) {
        try {
            return ElementsMap[element][0]
        } catch {
            continue
        }
    }
    return -1
}