import { SkillTag } from "@interknot/types"
import { Stack, Text, Space, } from "@mantine/core"
import { getTagName } from "@localization"
import "./DamageChip.css"

interface IDamageChipProps {
    actionName?: string
    tag?: SkillTag
    hover?: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

export default function DamageChip({ actionName, tag, hover, onMouseEnter, onMouseLeave }: IDamageChipProps): React.ReactElement {
    const doHover = hover ?? false
    return (
        <Stack gap="0" className="damage-chip" data-tag={tag} data-hover={doHover} 
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {tag
                ? <Text fz="0.8rem" fw={700}>{getTagName(tag)}</Text>
                : <Space h="2rem" />
            }
            
            {actionName 
                ? <Text fz="0.8rem">{actionName?.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}</Text>
                : <Space h="2rem" />
            }
        </Stack>
    )
}