import { AgentAction, BaseLeaderboardEntry } from "@interknot/types"
import { Stack, Text, Flex } from "@mantine/core"
import { memo, useEffect, useMemo, useState } from "react"
import { IconEqual } from "@tabler/icons-react"
import DamageBar from "@components/DamageBar/DamageBar"
import { buildSegments } from "@components/DamageBar/segments"
import "./DamageDistribution.css"
import LeaderboardEntrySelect from "@components/LeaderboardEntrySelect"
import DamageChipPart from "@components/DamageChip/DamageChip"

interface IDamageDistributionProps {
    entries: BaseLeaderboardEntry[]
    initialLeaderboardId?: number
    onLeaderboardSelect?: (lb: BaseLeaderboardEntry) => void
}

export default function DamageDistribution({ entries, initialLeaderboardId, onLeaderboardSelect }: IDamageDistributionProps): React.ReactElement {
    const idx = initialLeaderboardId ? entries.findIndex(e => e.Leaderboard.Id === initialLeaderboardId) : 0

    const [lbIdx, setLbIdx] = useState<number>(idx)
    const [barHover, setBarHover] = useState({ idx: -1, groupIdx: -1 })
    const [chipHover, setChipHover] = useState<number>(-1)

    useEffect(() => {
        onLeaderboardSelect?.(entries[lbIdx])
    }, [lbIdx, entries, onLeaderboardSelect])

    const currentLeaderboard = useMemo(() => entries[lbIdx], [entries, lbIdx])
    const rotation = useMemo(() => currentLeaderboard.RotationValue.filter(rv => rv.Damage !== 0 && rv.AgentId === currentLeaderboard.Leaderboard.Character.Id), [currentLeaderboard])
    const groups = useMemo(() => currentLeaderboard.Groups, [currentLeaderboard])

    const segments = useMemo(() => buildSegments(rotation, groups ?? []), [rotation, groups])
    const total = useMemo(() => rotation.reduce((sum, a) => sum + a.Damage, 0), [rotation])

    const chipProps = (action: AgentAction, idx: number) => ({
        action,
        first: idx === 0,
        hover: barHover.idx === idx || chipHover === idx,
        onHover: (hovered: boolean) => setChipHover(hovered ? idx : -1)
    })

    return (
        <Stack ml="xl" mr="xl" mb="xl" align="flex-start">
            <LeaderboardEntrySelect
                entries={entries}
                initialLeaderboardId={initialLeaderboardId ?? entries[0].Leaderboard.Id}
                onEntrySelect={(entry) => {
                    const newIdx = entries.findIndex(e => e.Leaderboard.Id === entry.Leaderboard.Id)
                    setLbIdx(newIdx)
                }} />
            <DamageBar actions={rotation} groups={groups} hoverIdx={chipHover} onHighlight={(idx, groupIdx) => {
                setBarHover({ idx, groupIdx })
            }} />
            <Flex gap="0.5rem 0" wrap="wrap" justify="center" align="center">
                <div key={`dmg-chip-part-${idx}`} className="dmg-chip">
                    <Text className="dc-damage">{Math.trunc(total).toLocaleString()}</Text>
                </div>
                <IconEqual size="16px" style={{ margin: "0 0.1rem" }} />
                {
                    segments.flatMap(segment => segment.kind === "action"
                        ? <DamageChipPart key={`dmg-chip-part-${segment.index}`} {...chipProps(segment.action, segment.index)} />
                        : segment.actions.map((action, j) => <DamageChipPart key={`dmg-chip-part-${segment.index + j}`}
                            groupActive={barHover.groupIdx === segment.index} 
                            {...chipProps(action, segment.index + j)} />))
                }
            </Flex>
        </Stack>
    )
}

export const DamageDistributionMemoized = memo(DamageDistribution)