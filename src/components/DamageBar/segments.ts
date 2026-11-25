import type { ActionGroup, AgentAction } from "@interknot/types"

export interface ActionSegment {
    kind: "action"
    key: string
    index: number
    action: AgentAction
}

export interface GroupSegment {
    kind: "group"
    key: string
    index: number
    group: ActionGroup
    actions: AgentAction[]
    damage: number
}

export type DamageSegment = ActionSegment | GroupSegment

export function buildSegments(actions: AgentAction[], groups: ActionGroup[]): DamageSegment[] {
    const indexById = new Map(actions.map((a, i) => [a.Id, i]))
    const claimed = new Array<boolean>(actions.length).fill(false)
    const groupAt = new Map<number, { group: ActionGroup, end: number }>()

    for (const group of groups) {
        const indices = [...new Set(group.ActionIds.map(id => indexById.get(id)))]
            .filter((i): i is number => i !== undefined)
            .sort((a, b) => a - b)
        if (indices.length === 0) continue

        const start = indices[0]
        const end = indices[indices.length - 1]
        if (end - start + 1 !== indices.length) continue
        if (claimed.slice(start, end + 1).some(Boolean)) continue

        claimed.fill(true, start, end + 1)
        groupAt.set(start, { group, end })
    }

    const segments: DamageSegment[] = []
    for (let i = 0; i < actions.length;) {
        const g = groupAt.get(i)
        if (g) {
            const groupActions = actions.slice(i, g.end + 1)
            segments.push({
                kind: "group",
                key: `group-${i}`,
                index: i,
                group: g.group,
                actions: groupActions,
                damage: groupActions.reduce((sum, a) => sum + a.Damage, 0)
            })
            i = g.end + 1
        } else {
            segments.push({ kind: "action", key: `action-${i}`, index: i, action: actions[i] })
            i++
        }
    }
    return segments
}

export function segmentLength(segment: DamageSegment): number {
    return segment.kind === "group" ? segment.actions.length : 1
}
