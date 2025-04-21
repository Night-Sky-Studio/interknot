import { Property } from "@interknot/types"
import { Group, Table } from "@mantine/core"
import { ZenlessIcon } from "../icons/Icons"

export default function PropertyCell({ ref, prop, className, useDiv }: { ref?: any, prop: Property, className?: string, useDiv?: boolean }): React.ReactElement {
    return (
        <Table.Td ref={ref} component={useDiv ? "div" : undefined} bg="rgba(0 0 0 / 5%)" className={className}>
            <Group gap="4px" wrap="nowrap">
                <ZenlessIcon id={prop.Id} size={18} color="white" />
                <span>{prop.formatted}</span>
            </Group>
        </Table.Td>
    )
}