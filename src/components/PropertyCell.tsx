import { Property } from "@interknot/types"
import { Group, Table } from "@mantine/core"
import { ZenlessIcon } from "./icons/Icons"

export default function PropertyCell({ prop }: { prop: Property }): React.ReactElement {
    return (
        <Table.Td bg="rgba(0 0 0 / 5%)">
            <Group gap="4px" wrap="nowrap">
                <ZenlessIcon id={prop.Id} size={18} color="white" />
                <span>{prop.formatted}</span>
            </Group>
        </Table.Td>
    )
}