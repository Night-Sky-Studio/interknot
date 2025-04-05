import { BaseWeapon } from "@interknot/types"
import { ActionIcon, Image } from "@mantine/core"
import { getLocalString } from "../localization/Localization"
import { useNavigate } from "react-router"

interface IWeaponButtonProps {
    id: number
    weapon: BaseWeapon
    selected?: boolean
}

export default function WeaponButton({ id, weapon, selected } : IWeaponButtonProps): React.ReactElement {
    const navigate = useNavigate()
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