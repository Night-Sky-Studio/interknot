import { BaseWeapon } from "@interknot/types"
import { ActionIcon, Image } from "@mantine/core"
import { useNavigate } from "react-router"
import { useSettings } from "./SettingsProvider"

interface IWeaponButtonProps {
    id: number
    weapon: BaseWeapon
    selected?: boolean
}

export default function WeaponButton({ id, weapon, selected } : IWeaponButtonProps): React.ReactElement {
    const navigate = useNavigate()
    const { getLocalString } = useSettings()
    return (
        <ActionIcon variant={selected ? "filled" : "subtle"} p="0" style={{ overflow: "visible" }}
            onClick={(e) => {
                e.stopPropagation()
                navigate(`/leaderboards/${id}`)
            }}>
            <Image h="38px" src={weapon.ImageUrl} alt={getLocalString(weapon.Name)} />
        </ActionIcon>
    )
}