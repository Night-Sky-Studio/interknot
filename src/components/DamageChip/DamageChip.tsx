import { AgentAction } from "@interknot/types"
import {  Text, Group, } from "@mantine/core"
import "./DamageChip.css"
import { IconPlus } from "@tabler/icons-react"
import { getTag } from "@components/tags"

interface IDamageChipPartProps {
    action: AgentAction
    first: boolean
    groupActive?: boolean
    hover: boolean
    onHover: (hovered: boolean) => void
}

export default function DamageChipPart({ action, first, groupActive, hover, onHover }: IDamageChipPartProps) {
    return (<Group wrap="nowrap" gap="0px">
        {!first &&
            <IconPlus size="16px" style={{ margin: "0 0.1rem" }} />
        }
        <div className="dmg-chip" data-tag={getTag(action.Tag)} data-hover={hover} data-group-active={groupActive}
            onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
            <Text className="dc-damage">{Math.trunc(action.Damage).toLocaleString()}</Text>
        </div>
    </Group>)
}