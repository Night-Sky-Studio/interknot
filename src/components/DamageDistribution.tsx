import { AgentAction, BaseLeaderboardEntry } from "@interknot/types"
import { Stack, Group, Select, Center } from "@mantine/core"
import DamageChip from "./DamageChip"
import { memo, useEffect, useState } from "react"
import { IconEqual, IconPlus } from "@tabler/icons-react"
import DamageBar from "./DamageBar"
import "./styles/DamageDistribution.css"
import { useSettings } from "./SettingsProvider"
import { useLeaderboards } from "./LeaderboardProvider"

interface IDamageDistributionProps {
    entries: BaseLeaderboardEntry[]
    onLeaderboardSelect?: (lb: BaseLeaderboardEntry) => void
}

export default function DamageDistribution({ entries, onLeaderboardSelect }: IDamageDistributionProps): React.ReactElement {
    const leaderboards = useLeaderboards()
    const characterId = entries[0].Leaderboard.Character.Id
    const idx = entries.findIndex(e => e.Leaderboard.Id === leaderboards.agents.find(c => c.Leaderboard.Character.Id === characterId)?.Leaderboard.Id)

    const [lbIdx, setLbIdx] = useState<number>(idx)
    const [hoverIdx, setHoverIdx] = useState<number>(-1)

    useEffect(() => {
        onLeaderboardSelect?.(entries[lbIdx])
    }, [lbIdx, entries, onLeaderboardSelect])

    const { getLocalString } = useSettings()

    const DmgChipPart = ({ action, idx } : { action: AgentAction, idx: number }) => {
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
            {idx !== entries[lbIdx].RotationValue.length - 1 &&
                <IconPlus />
            }
        </>)
    }

    return (<Center w="100%">
        <Stack ml="xl" mr="xl" mb="xl" w="75%" align="flex-start">
            <Select label="Select Leaderboard" w="30%" data={entries.map((e, i) => {
                return {
                    label: `${e.Leaderboard.Name} - ${getLocalString(e.Leaderboard.Weapon.Name)}`,
                    value: i.toString()
                }
            })} value={lbIdx.toString()} allowDeselect={false} onChange={(v) => setLbIdx(Number(v))} />
            <DamageBar actions={entries[lbIdx].RotationValue} hoverIdx={hoverIdx} onHighlight={(idx) => {
                setHoverIdx(idx)
            }} />
            <Group gap="0">
                <DamageChip damage={entries[lbIdx].RotationValue.map(r => r.Damage).reduce((prev, curr) => curr += prev)} />
                <IconEqual />
                {
                    entries[lbIdx].RotationValue.map((action, idx) => 
                        <DmgChipPart key={`dmg-chip-${entries[lbIdx].Leaderboard.Name}-${idx}`} 
                            action={action} idx={idx} />
                    )
                }
            </Group>
        </Stack>
    </Center>)
}

export const DamageDistributionMemoized = memo(DamageDistribution)