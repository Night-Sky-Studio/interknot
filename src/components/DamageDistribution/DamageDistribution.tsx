import { AgentAction, BaseLeaderboardEntry } from "@interknot/types"
import { Stack, Group, Text, Flex } from "@mantine/core"
import { memo, useEffect, useMemo, useState } from "react"
import { IconEqual, IconPlus } from "@tabler/icons-react"
import DamageBar from "@components/DamageBar/DamageBar"
import "./DamageDistribution.css"
import "@components/DamageChip/DamageChip.css"
import LeaderboardEntrySelect from "@components/LeaderboardEntrySelect"

interface IDamageDistributionProps {
    entries: BaseLeaderboardEntry[]
    initialLeaderboardId?: number
    onLeaderboardSelect?: (lb: BaseLeaderboardEntry) => void
}

export default function DamageDistribution({ entries, initialLeaderboardId, onLeaderboardSelect }: IDamageDistributionProps): React.ReactElement {
    // const leaderboards = useLeaderboards() 
    // const characterId = entries[0].Leaderboard.Character.Id

    const idx = initialLeaderboardId ? entries.findIndex(e => e.Leaderboard.Id === initialLeaderboardId) : 0

    const [lbIdx, setLbIdx] = useState<number>(idx)
    const [hoverIdx, setHoverIdx] = useState<number>(-1)

    useEffect(() => {
        onLeaderboardSelect?.(entries[lbIdx])
    }, [lbIdx, entries, onLeaderboardSelect])

    // const { getLocalString } = useSettings()

    const rotation = useMemo(() => entries[lbIdx].RotationValue.filter(rv => rv.Damage !== 0), [entries, lbIdx])

    const DmgChipPart = ({ action, idx } : { action: AgentAction, idx: number }) => {
        return (<Group wrap="nowrap" gap="0px">
            {idx !== 0 &&
                <IconPlus size="16px" style={{ margin: "0 0.1rem" }} />
            }
            <div className="dmg-chip">
                <Text className="dc-damage">{Math.trunc(action.Damage).toLocaleString()}</Text>
            </div>
        </Group>)
    }

    return (
        <Stack ml="xl" mr="xl" mb="xl" align="flex-start">
            <LeaderboardEntrySelect
                entries={entries}
                initialLeaderboardId={initialLeaderboardId ?? entries[0].Leaderboard.Id}
                onEntrySelect={(entry) => {
                    const newIdx = entries.findIndex(e => e.Leaderboard.Id === entry.Leaderboard.Id)
                    setLbIdx(newIdx)
                }} />
            <DamageBar actions={rotation} hoverIdx={hoverIdx} onHighlight={(idx) => {
                setHoverIdx(idx)
            }} />
            <Flex gap="0.5rem 0" wrap="wrap" justify="center" align="center">
                {/* <DamageChip damage={rotation.map(r => r.Damage).reduce((prev, curr) => curr += prev)} /> */}
                <div key={`dmg-chip-part-${idx}`} className="dmg-chip">
                    <Text className="dc-damage">{Math.trunc(rotation.map(r => r.Damage).reduce((prev, curr) => curr += prev)).toLocaleString()}</Text>
                </div>
                <IconEqual size="16px" style={{ margin: "0 0.1rem" }} />
                {
                    rotation.map((action, idx) => <DmgChipPart action={action} idx={idx} key={`dmg-chip-part-${idx}`} />)
                }
            </Flex>
        </Stack>
    )
}

export const DamageDistributionMemoized = memo(DamageDistribution)