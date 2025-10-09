import { AgentAction } from "@interknot/types"
import { getTagName, getTagShortName } from "@localization"
import "./DamageBar.css"
import { Center, Popover, Stack, Text } from "@mantine/core"
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
                actions.map((action, i) => (
                    <Popover key={`dmg-bar-${action.Name}-${i ^ action.Damage}`}
                        withArrow opened={i === idx} transitionProps={{ duration: 0 }} withinPortal>
                        <Popover.Target>
                            <div 
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
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack gap="0px">
                                <Text fw={500}>{action.Name.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}</Text>
                                <Text fz="0.75rem" fw={700} className="">{getTagName(action.Tag)}</Text>
                                <Text fz="1.5rem" fw={600}>{Math.trunc(action.Damage).toLocaleString()}</Text>
                                <Text c="dimmed">{((action.Damage / total) * 100).toFixed(1)}% of total</Text>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                ))
            }
        </div>
    </Center>
}