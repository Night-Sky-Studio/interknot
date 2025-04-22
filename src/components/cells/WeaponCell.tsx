import { Weapon, BaseWeapon } from "@interknot/types"
import { Group, Table, Image, Text, TableTdProps, Tooltip } from "@mantine/core"
import "./styles/WeaponCell.css"
import { useMemo } from "react"
import { useSettings } from "../SettingsProvider"

interface IWeaponCellProps extends TableTdProps {
    weapon: Weapon | null
    compareWith?: BaseWeapon | null
}

export default function WeaponCell({ weapon, compareWith, ...props }: IWeaponCellProps): React.ReactElement {
    const matches = useMemo(() => {
        if (!compareWith) return false;
        return weapon?.Id !== compareWith.Id;
    }, [weapon, compareWith]);
    const { getLocalString } = useSettings()
    return (
        <Table.Td className="weapon-cell" {...props}>
            {weapon && 
                <Tooltip label={getLocalString(weapon.Name)} openDelay={500}>
                    <Group gap="-14px" className={compareWith && matches ? "strike" : ""} align="flex-end" w="fit-content" wrap="nowrap">
                        <Image src={weapon.ImageUrl} h="32px" />
                        <Text size="10pt" className={compareWith && !matches && weapon.UpgradeLevel !== 1 ? "strike" : ""}>P{weapon?.UpgradeLevel}</Text>
                    </Group>
                </Tooltip>
            }
        </Table.Td>
    )
}