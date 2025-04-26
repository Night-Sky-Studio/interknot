import { LeaderboardAgent } from "@interknot/types"
import { Stack, Group, Select, Center } from "@mantine/core"
import DamageChip from "./DamageChip"
import { memo, useEffect, useState } from "react"
import { IconEqual, IconPlus } from "@tabler/icons-react"
import DamageBar from "./DamageBar"
import "./styles/DamageDistribution.css"
import { useSettings } from "./SettingsProvider"

interface IDamageDistributionProps {
    entries: LeaderboardAgent[]
    index?: number
    onLeaderboardSelect?: (lb: LeaderboardAgent) => void
}

export default function DamageDistribution({ entries, index, onLeaderboardSelect }: IDamageDistributionProps): React.ReactElement {
    const [lbIdx, setLbIdx] = useState<number>(index ?? 0)
    const [hoverIdx, setHoverIdx] = useState<number>(-1)

    useEffect(() => {
        onLeaderboardSelect?.(entries[lbIdx])
    }, [lbIdx, entries, onLeaderboardSelect])

    const { getLocalString } = useSettings()

    const DmgChipPart = ({ action, idx } : any) => {
        return (<>
            <DamageChip
                actionName={action.Name}
                damage={action.Damage}
                tag={action.Tag}
                hover={idx == hoverIdx}
                onMouseEnter={() => {
                    setHoverIdx(idx)
                }} 
                onMouseLeave={() => {
                    setHoverIdx(-1)
                }}/>
            {idx !== entries[lbIdx].Rotation.length - 1 &&
                <IconPlus />
            }
        </>)
    }

    return (<Center w="100%">
        <Stack ml="xl" mr="xl" mb="xl" w="75%" align="flex-start">
            <Select label="Select Leaderboard" w="30%" data={entries.map((e, i) => {
                return {
                    label: `${e.LeaderboardName} - ${getLocalString(e.Weapon.Name)}`,
                    value: i.toString()
                }
            })} value={lbIdx.toString()} allowDeselect={false} onChange={(v) => setLbIdx(Number(v))} />
            <DamageBar actions={entries[lbIdx].Rotation} hoverIdx={hoverIdx} onHighlight={(idx) => {
                setHoverIdx(idx)
            }} />
            <Group gap="0">
                <DamageChip damage={entries[lbIdx].Rotation.map(r => r.Damage).reduce((prev, curr) => curr += prev)} />
                <IconEqual />
                {
                    entries[lbIdx].Rotation.map((action, idx) => 
                        <DmgChipPart key={`dmg-chip-${entries[lbIdx].LeaderboardName}-${idx}`} 
                            action={action} idx={idx} />
                    )
                }
            </Group>
        </Stack>
    </Center>)
}

export const DamageDistributionMemoized = memo(DamageDistribution)