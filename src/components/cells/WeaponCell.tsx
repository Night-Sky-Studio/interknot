import { Weapon, BaseWeapon } from "@interknot/types"
import { Group, Table, Image, Text, TableTdProps } from "@mantine/core"
import "./styles/WeaponCell.css"
import { useMemo } from "react"

interface IWeaponCellProps extends TableTdProps {
    weapon: Weapon | null
    compareWith?: BaseWeapon | null
}

export default function WeaponCell({ weapon, compareWith, ...props }: IWeaponCellProps): React.ReactElement {
    const matches = useMemo(() => {
        if (!compareWith) return true
        return weapon?.Id !== compareWith?.Id
    }, [weapon, compareWith])
    return (
        <Table.Td {...props} className="weapon-cell">
            {weapon && 
                <Group gap="-14px" className={matches ? "strike" : ""} align="flex-end" wrap="nowrap">
                    <Image src={weapon.ImageUrl} h="32px" />
                    <Text size="10pt" className={!matches && weapon.UpgradeLevel != 1 ? "strike" : ""}>P{weapon?.UpgradeLevel}</Text>
                </Group>
            }
        </Table.Td>
    )
}