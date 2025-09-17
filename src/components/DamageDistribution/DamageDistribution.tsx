import { AgentAction, BaseLeaderboardEntry } from "@interknot/types"
import { Stack, Group, Select, Center } from "@mantine/core"
import DamageChip from "@components/DamageChip/DamageChip"
import { memo, useEffect, useMemo, useState } from "react"
import { IconEqual, IconPlus } from "@tabler/icons-react"
import DamageBar from "@components/DamageBar/DamageBar"
import "./DamageDistribution.css"
import { useSettings } from "@components/SettingsProvider"
import { useLeaderboards } from "@components/LeaderboardProvider"

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

    const rotation = useMemo(() => entries[lbIdx].RotationValue.filter(rv => rv.Damage !== 0), [entries, lbIdx])

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
            {idx !== rotation.length - 1 &&
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
            <DamageBar actions={rotation} hoverIdx={hoverIdx} onHighlight={(idx) => {
                setHoverIdx(idx)
            }} />
            <Group gap="0">
                <DamageChip damage={rotation.map(r => r.Damage).reduce((prev, curr) => curr += prev)} />
                <IconEqual />
                {
                    rotation.map((action, idx) => 
                        <DmgChipPart key={`dmg-chip-${entries[lbIdx].Leaderboard.Name}-${idx}`} 
                            action={action} idx={idx} />
                    )
                }
            </Group>
        </Stack>
    </Center>)
}

export const DamageDistributionMemoized = memo(DamageDistribution)