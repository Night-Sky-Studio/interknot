import type { PropertyList } from "../../api/EnkaResponse"
import property from "../raw/property.json"
import { getLocalString } from "../types/Localization"
import { type Property, type IValueProperty, ValueProperty, DriveDiskProperty } from "../types/Property"
import { getEquipmentLevelStatMultiplier } from "./RawDataTablesMapper"

type RawProperty = {
    Name: string
    Format: string
}

const Property = property as Record<string, RawProperty>

export const valuePropertyMapper = (id: string, val: number) => mapValueProperty(parseInt(id), val)

function mapProperty(id: number, prop: RawProperty): Property {
    return {
        Id: id,
        Name: getLocalString(prop.Name),
        Format: prop.Format
    }
}

export function getProperty(id: number): Property {
    return mapProperty(id, Property[id])
}

export function getPropertyByName(name: string): Property | null {
    for (let key of Object.keys(Property)) {
        if (Property[key].Name.toLowerCase() === name.toLowerCase()) {
            return getProperty(parseInt(key))
        }
    }
    return null
}

export function mapValueProperty(id: number, value: number): ValueProperty {
    return ValueProperty.fromProp(getProperty(id), value)
}

export function mapDriveDiskProperty(prop: PropertyList): DriveDiskProperty {
    return DriveDiskProperty.fromProp(ValueProperty.fromProp(getProperty(prop.PropertyId), prop.PropertyValue), prop.PropertyLevel)
}