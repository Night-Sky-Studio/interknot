import React from "react"
import * as Elements from "./elements/index" 
import * as Stats from "./stats/index"
import { Image } from "@mantine/core"

import anomaly from "../../../assets/icons/spec/anomaly.webp"
import attack from "../../../assets/icons/spec/attack.webp"
import defense from "../../../assets/icons/spec/defense.webp"
import stun from "../../../assets/icons/spec/stun.webp"
import support from "../../../assets/icons/spec/support.webp"

const ElementTypesMap: Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    "Physics": Elements.Physics,
    "Fire": Elements.Fire,
    "Ice": Elements.Ice,
    "Elec": Elements.Elec,
    "Ether": Elements.Ether,
    "FireFrost": Elements.Firefrost,
}

const PropertyTypesMap: Record<number, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    // Stats
    11101: Stats.Hp, 11102: Stats.Hp, 11103: Stats.Hp,
    12101: Stats.Atk, 12102: Stats.Atk, 12103: Stats.Atk,
    13101: Stats.Def, 13102: Stats.Def, 13103: Stats.Def,
    12201: Stats.Impact, 12202: Stats.Impact, 12203: Stats.Impact,
    20101: Stats.Cr, 20102: Stats.Cr, 20103: Stats.Cr,
    21101: Stats.Cd, 21102: Stats.Cd, 21103: Stats.Cd,
    30501: Stats.Er, 30502: Stats.Er, 30503: Stats.Er,
    31401: Stats.AnomalyMastery, 31402: Stats.AnomalyMastery, 31403: Stats.AnomalyMastery,
    31201: Stats.AnomalyProficiency, 31202: Stats.AnomalyProficiency, 31203: Stats.AnomalyProficiency,
    23101: Stats.PenRatio, 23103: Stats.PenRatio, 23105: Stats.PenRatio,
    23201: Stats.Pen, 23203: Stats.Pen, 23205: Stats.Pen,

    // Elements
    31501: Elements.Physics, 31503: Elements.Physics, 31505: Elements.Physics, 
    31601: Elements.Fire, 31603: Elements.Fire, 31605: Elements.Fire, 
    31701: Elements.Ice, 31703: Elements.Ice, 31705: Elements.Ice, 
    31801: Elements.Elec, 31803: Elements.Elec, 31805: Elements.Elec, 
    31901: Elements.Ether, 31903: Elements.Ether, 31905: Elements.Ether,
}

interface IZenlessIconProps {
    id?: number
    elementName?: string
    size?: string | number
    color?: string
    className?: string
    style?: React.CSSProperties
}

export function ZenlessIcon({ id, elementName, size, color, className, style }: IZenlessIconProps): React.ReactElement {
    const Icon = id ? PropertyTypesMap[id] : elementName ? ElementTypesMap[elementName] : undefined;
    
    if (!Icon) {
        console.warn(`Icon ${id}${elementName} was not found`)
        return <span>?</span>
    }

    return <Icon width={size} height={size} color={color} className={className} style={style} />;
}

const ProfessionsMap: Record<string, string> = {
    "Anomaly": anomaly,
    "Attack": attack,
    "Defense": defense,
    "Stun": stun,
    "Support": support,
}

interface IProfessionIconProps {
    name: string
    size?: number
    style?: React.CSSProperties
    className?: string
}

export function ProfessionIcon({ name, size, style, className }: IProfessionIconProps): React.ReactElement {
    return (<Image className={className} style={style} h={(size ?? 16) + "px"} src={ProfessionsMap[name]} alt={name} />)
}