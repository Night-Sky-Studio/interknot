import { DriveDiscSet } from "@interknot/types";
import { Group, GroupProps, Image, Text, Tooltip } from "@mantine/core";
import { useSettings } from "../SettingsProvider";

interface IDriveDiscsCellProps extends GroupProps {
    sets: DriveDiscSet[]
}

export default function DriveDiscsCell({ sets, ...props }: IDriveDiscsCellProps): React.ReactElement {
    const { getLocalString } = useSettings()
    return (
        <Group /*w="160px"*/ gap="8px" wrap="nowrap" {...props}>
            {
                sets.map(set => {
                    return (
                        <Tooltip key={set.Set.Id} label={getLocalString(set.Set.Name)} openDelay={500} 
                            portalProps={{ reuseTargetNode: true }}>
                            <Group gap="-14px" align="flex-end" wrap="nowrap">
                                <Image src={set.Set.IconUrl} h="32px" /> 
                                <Text size="10pt">{set.Count}</Text>
                            </Group>
                        </Tooltip>
                    )
                })
            }
        </Group>
    )
}