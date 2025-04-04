import React from "react"
import { useMantineTheme } from "@mantine/core"
import "./styles/CritCell.css"

export default function CritCell({ cr, cd, cv }: { cr: string, cd: string, cv: number }): React.ReactElement {
    const cvWeight = (critValue: number) => {
        switch (true) {
            case critValue >= 200: return 800
            case critValue >= 180: return 700
            case critValue >= 170: return 600
            case critValue >= 160: return 500
            case critValue >= 150: return 400
            default: return undefined
        }
    }
    const cvColor = (critValue: number) => {
        const theme = useMantineTheme()
        switch (true) {
            case critValue >= 200: return theme.colors.red[7]
            case critValue >= 180: return theme.colors.pink[7]
            case critValue >= 170: return theme.colors.grape[7]
            case critValue >= 160: return theme.colors.violet[6]
            case critValue >= 150: return theme.colors.blue[5]
            default: return undefined
        }
    }

    return (
        <div className="crit-cell">
            <div>
                { cr } : { cd }
            </div>
            <div style={{ color: cvColor(cv), fontWeight: cvWeight(cv) }}>
                {cv} cv
            </div>
        </div>
    )
}