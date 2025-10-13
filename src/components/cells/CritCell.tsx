import React from "react"
import { Group, Text, useMantineTheme } from "@mantine/core"
import "./styles/CritCell.css"
import { useSettings } from "../SettingsProvider"
import { match } from "@interknot/types"
import { ZenlessIcon } from "../icons/Icons"

export const cvWeight = (critValue: number) => match(critValue, [
    [cv => cv >= 200, () => 800],
    [cv => cv >= 180, () => 700],
    [cv => cv >= 170, () => 600],
    [cv => cv >= 160, () => 500],
    [cv => cv >= 150, () => 400],
    () => undefined
])

export const cvColor = (critValue: number) => {
    const theme = useMantineTheme()
    return match(critValue, [
        [cv => cv >= 200, () => theme.colors.red[7]],
        [cv => cv >= 180, () => theme.colors.pink[7]],
        [cv => cv >= 170, () => theme.colors.grape[7]],
        [cv => cv >= 160, () => theme.colors.violet[6]],
        [cv => cv >= 150, () => theme.colors.blue[5]],
        () => undefined
    ])
}

export const discCvWeight = (critValue: number) => match(critValue, [
    [cv => cv >= 3360, () => 800],
    [cv => cv >= 2880, () => 700],
    [cv => cv >= 2400, () => 600],
    [cv => cv >= 1920, () => 500],
    [cv => cv >= 1600, () => 400],
    () => undefined
])

export const discCvColor = (critValue: number) => {
    const theme = useMantineTheme()
    return match(critValue, [
        [cv => cv >= 3360, () => theme.colors.red[7]],
        [cv => cv >= 2880, () => theme.colors.pink[7]],
        [cv => cv >= 2400, () => theme.colors.grape[7]],
        [cv => cv >= 1920, () => theme.colors.violet[6]],
        [cv => cv >= 1600, () => theme.colors.blue[5]],
        () => undefined
    ])
}


export default function CritCell({ cr, cd, cv }: { cr: string, cd: string, cv: number }): React.ReactElement {
    const { cvEnabled } = useSettings()

    return (<>
        { cvEnabled 
            ? <div className="crit-cell">
                <div>
                    { cr } : { cd }
                </div>
                <div style={{ color: cvColor(cv), fontWeight: cvWeight(cv) }}>
                    {cv} cv
                </div>
            </div>
        : <Group gap="8px">
            <Group gap="4px" wrap="nowrap" w="7ch">
                <ZenlessIcon color="white" id={20103} size={16} />
                <Text>{ cr }</Text>
            </Group>
            <Group gap="4px" wrap="nowrap">
                <ZenlessIcon color="white" id={21103} size={16} />
                <Text>{ cd }</Text>
            </Group>
        </Group>
        }
    </>)
}