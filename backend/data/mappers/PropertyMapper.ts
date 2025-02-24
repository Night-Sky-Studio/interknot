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