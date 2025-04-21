import { DriveDiscSet } from "@interknot/types";
import { Group, Image, Table, Text } from "@mantine/core";

export default function DriveDiscsCell({ sets }: { sets: DriveDiscSet[] }): React.ReactElement {
    return <Table.Td w="160px">
        <Group gap="8px" wrap="nowrap">
            {
                sets.map(set => {
                    return (
                        <Group key={set.Set.Id} gap="-14px" align="flex-end" wrap="nowrap">
                            <Image src={set.Set.IconUrl} h="32px" /> 
                            <Text size="10pt">{set.Count}</Text>
                        </Group>
                    )
                })
            }
        </Group>
    </Table.Td>
}
