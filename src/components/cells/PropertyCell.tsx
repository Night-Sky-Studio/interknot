import { Property } from "@interknot/types"
import { Group } from "@mantine/core"
import { ZenlessIcon } from "../icons/Icons"

export default function PropertyCell({ ref, prop, className }: { ref?: any, prop: Property, className?: string }): React.ReactElement {
    return (
        <Group gap="4px" ref={ref} wrap="nowrap" className={className}>
            <ZenlessIcon id={prop.Id} size={18} color="white" />
            <span>{prop.formatted}</span>
        </Group>
    )
}