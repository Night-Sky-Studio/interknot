import type { AgentAction, ActionGroup } from "@interknot/types"
import { getTagName, getTagShortName } from "@localization"
import "./DamageBar.css"
import { Center, Popover, Stack, Text } from "@mantine/core"
import { useEffect, useMemo, useState } from "react"
import { buildSegments, segmentLength, type GroupSegment } from "./segments"
import { getTag } from "@components/tags"

interface IDamageBarProps {
    actions: AgentAction[]
    groups?: ActionGroup[]
    hoverIdx?: number
    onHighlight?: (idx: number, groupIdx: number) => void
}

const formatActionName = (name: string): string =>
    name.replaceAll("#", "").split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")

const percent = (value: number, total: number): string =>
    `${(total === 0 ? 0 : (value / total) * 100).toFixed(1)}%`

const widthStyle = (value: number, total: number): React.CSSProperties =>
    ({ "--width": `${total === 0 ? 0 : (value / total) * 100}%` } as React.CSSProperties)

function ActionDetails({ action, total }: { action: AgentAction, total: number }): React.ReactElement {
    return <Stack gap="0px">
        <Text fw={500}>{formatActionName(action.Name)}</Text>
        <Text fz="0.75rem" fw={700}>{getTagName(getTag(action.Tag))}</Text>
        <Text fz="1.5rem" fw={600}>{Math.trunc(action.Damage).toLocaleString()}</Text>
        <Text c="dimmed">{percent(action.Damage, total)} of total</Text>
    </Stack>
}

interface IGroupDropdownProps {
    segment: GroupSegment
    total: number
    innerIdx: number
    onInnerHover: (idx: number) => void
}

function GroupDropdownContent({ segment, total, innerIdx, onInnerHover }: IGroupDropdownProps): React.ReactElement {
    const inner = innerIdx >= 0 ? segment.actions[innerIdx] : undefined

    return <Stack gap="xs">
        <Text fw={500}>{formatActionName(segment.group.Name)}</Text>
        <div className="dmg-bar dmg-bar-inner" style={{ "--count": segment.actions.length } as React.CSSProperties}
            onMouseLeave={() => onInnerHover(-1)}>
            {
                segment.actions.map((action, j) => (
                    <div key={`dmg-bar-inner-${segment.index + j}`}
                        style={widthStyle(action.Damage, segment.damage)}
                        data-tag={getTag(action.Tag)}
                        data-hover={innerIdx === j}
                        onMouseEnter={() => onInnerHover(j)}
                        onClick={() => onInnerHover(j)}>
                        {getTagShortName(getTag(action.Tag))}
                    </div>
                ))
            }
        </div>

        <Stack gap="0px">
            <Text fw={500}>{inner ? formatActionName(inner.Name) : "Total"}</Text>
            <Text fz="0.75rem" fw={700}>
                {inner ? getTagName(getTag(inner.Tag)) : `${segment.actions.length} hits`}
            </Text>
            <Text fz="1.5rem" fw={600}>{Math.trunc(inner?.Damage ?? segment.damage).toLocaleString()}</Text>
            <Text c="dimmed">
                {inner
                    ? `${percent(inner.Damage, segment.damage)} of combo // ${percent(inner.Damage, total)} of total`
                    : `${percent(segment.damage, total)} of total`}
            </Text>
        </Stack>
    </Stack>
}

export default function DamageBar({ actions, groups = [], hoverIdx = -1, onHighlight }: IDamageBarProps): React.ReactElement {
    const total = useMemo(() => actions.reduce((sum, a) => sum + a.Damage, 0), [actions])
    const segments = useMemo(() => buildSegments(actions, groups), [actions, groups])

    const [activeKey, setActiveKey] = useState<string | null>(null)
    const [innerIdx, setInnerIdx] = useState(-1)

    const open = (key: string) => {
        if (key !== activeKey) setInnerIdx(-1)
        setActiveKey(key)
    }
    const close = () => {
        setActiveKey(null)
        setInnerIdx(-1)
    }
    // Closes a group popover unless the pointer moved between the group's segment and its dropdown
    const leaveGroup = (e: React.MouseEvent, key: string) => {
        const to = e.relatedTarget
        if (to instanceof Element && to.closest(`[data-group-key="${key}"]`)) return
        close()
    }

    // Reset when the rotation changes, so a stale key doesn't point into a different layout
    useEffect(() => close(), [segments])

    const externalKey = useMemo(() => hoverIdx < 0
        ? null
        : segments.find(s => hoverIdx >= s.index && hoverIdx < s.index + segmentLength(s))?.key ?? null,
    [hoverIdx, segments])

    const activeSegment = useMemo(() => segments.find(s => s.key === activeKey), [segments, activeKey])
    const highlightedIdx = !activeSegment ? -1
        : activeSegment.kind === "action" ? activeSegment.index
        : innerIdx >= 0 ? activeSegment.index + innerIdx : -1
    const highlightedGroupIdx = activeSegment?.kind === "group" ? activeSegment.index : -1

    useEffect(() => {
        onHighlight?.(highlightedIdx, highlightedGroupIdx)
    }, [highlightedIdx, highlightedGroupIdx])

    return <Center w="100%" style={{ flexDirection: "column" }}>
        <Text mb="xs">Rotation damage distribution</Text>
        <div className="dmg-bar">
            {
                segments.map(segment => {
                    const isActive = segment.key === activeKey
                    const isHighlighted = isActive || segment.key === externalKey

                    if (segment.kind === "action") {
                        const { action } = segment
                        return <Popover key={segment.key} withArrow opened={isActive} transitionProps={{ duration: 0 }} withinPortal>
                            <Popover.Target>
                                <div
                                    style={widthStyle(action.Damage, total)}
                                    data-tag={getTag(action.Tag)}
                                    data-hover={isHighlighted}
                                    onMouseEnter={() => open(segment.key)}
                                    onMouseLeave={close}>
                                    {getTagShortName(getTag(action.Tag))}
                                </div>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <ActionDetails action={action} total={total} />
                            </Popover.Dropdown>
                        </Popover>
                    }

                    return <Popover key={segment.key} withArrow opened={isActive} transitionProps={{ duration: 0 }} withinPortal
                        position="bottom" onDismiss={close}>
                        <Popover.Target>
                            <div
                                style={widthStyle(segment.damage, total)}
                                data-group
                                data-group-key={segment.key}
                                data-hover={isHighlighted}
                                onMouseEnter={() => open(segment.key)}
                                onMouseLeave={(e) => leaveGroup(e, segment.key)}>
                                Combo
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown className="dmg-bar-group-dropdown"
                            data-group-key={segment.key}
                            onMouseLeave={(e) => leaveGroup(e, segment.key)}>
                            <GroupDropdownContent
                                segment={segment}
                                total={total}
                                innerIdx={isActive ? innerIdx : -1}
                                onInnerHover={setInnerIdx} />
                        </Popover.Dropdown>
                    </Popover>
                })
            }
        </div>
    </Center>
}
