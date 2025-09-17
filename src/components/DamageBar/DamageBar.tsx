import { AgentAction } from "@interknot/types"
import { getTagShortName } from "@localization"
import "./DamageBar.css"
import { Center, Text } from "@mantine/core"
import { useEffect, useState } from "react"

interface IDamageBarProps {
    actions: AgentAction[]
    hoverIdx: number
    onHighlight: (idx: number) => void
}

export default function DamageBar({ actions, hoverIdx, onHighlight }: IDamageBarProps): React.ReactElement {
    const total = actions.map(a => a.Damage).reduce((prev, curr) => curr += prev)
    
    const [idx, setIdx] = useState(hoverIdx)

    useEffect(() => {
        if (hoverIdx !== -1) {
            setIdx(hoverIdx)
        }
    }, [hoverIdx])

    useEffect(() => {
        onHighlight(idx)
    }, [idx])

    return <Center w="100%" style={{ flexDirection: "column" }}>
        <Text mb="xs">Rotation damage distribution</Text>
        <div className="dmg-bar">
            {
                actions.map((action, i) => <div key={`dmg-bar-${action.Name}-${i ^ action.Damage}`} 
                    style={{ "--width": `${(action.Damage / total) * 100}%` } as React.CSSProperties}
                    data-tag={action.Tag}
                    data-hover={idx === i}
                    onMouseEnter={() => {
                        setIdx(actions.indexOf(action))
                    }}
                    onMouseLeave={() => {
                        setIdx(-1)
                    }}>
                    {getTagShortName(action.Tag)}
                </div>)
            }
        </div>
    </Center>
}