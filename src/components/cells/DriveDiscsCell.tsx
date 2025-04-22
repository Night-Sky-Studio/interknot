import { DriveDiscSet } from "@interknot/types";
import { Group, Image, Table, TableTdProps, Text, Tooltip } from "@mantine/core";
import { useSettings } from "../SettingsProvider";

interface IDriveDiscsCellProps extends TableTdProps {
    sets: DriveDiscSet[]
}

export default function DriveDiscsCell({ sets, ...props }: IDriveDiscsCellProps): React.ReactElement {
    const { getLocalString } = useSettings()
    return <Table.Td w="160px" {...props}>
        <Group gap="8px" wrap="nowrap">
            {
                sets.map(set => {
                    return (
                        <Tooltip key={set.Set.Id} label={getLocalString(set.Set.Name)} openDelay={500}>
                            <Group gap="-14px" align="flex-end" wrap="nowrap">
                                <Image src={set.Set.IconUrl} h="32px" /> 
                                <Text size="10pt">{set.Count}</Text>
                            </Group>
                        </Tooltip>
                    )
                })
            }
        </Group>
    </Table.Td>
}
