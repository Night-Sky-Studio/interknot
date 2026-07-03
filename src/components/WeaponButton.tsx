import { BaseWeapon } from "@interknot/types"
import { ActionIcon, Badge, Button, Image, Tooltip } from "@mantine/core"
import { useNavigate } from "react-router"
import { useSettings } from "./SettingsProvider"

interface IWeaponButtonProps {
    id: number
    weapon: BaseWeapon
    refinementLevel?: number
    compact?: boolean
    selected?: boolean
}

export default function WeaponButton({ id, weapon, refinementLevel = 1, compact = false, selected = false } : IWeaponButtonProps): React.ReactElement {
    const navigate = useNavigate()
    const { getLocalString } = useSettings()

    const WeaponIcon = () => (<div className="weapon-icon" style={{ position: "relative" }}>
        <Image h="38px" src={weapon.ImageUrl} alt={getLocalString(weapon.Name)} />
        <Badge color="gray.9" size="xs" style={{ position: "absolute", bottom: "-4px", right: "-2px" }}>P{refinementLevel}</Badge>
    </div>)

    return (
        compact
            ? <Tooltip label={`${getLocalString(weapon.Name)} (P${refinementLevel})`} portalProps={{ reuseTargetNode: true }}>
                <ActionIcon variant={selected ? "filled" : "subtle"} p="0" style={{ overflow: "visible" }}
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/leaderboards/${id}`)
                    }}>
                    <WeaponIcon />
                </ActionIcon>
            </Tooltip>
            : <Button variant={selected ? "filled" : "subtle"} p="1.5rem 0.5rem" 
                style={{ overflow: "visible" }}
                onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/leaderboards/${id}`)
                }} leftSection={<WeaponIcon />}>
                { getLocalString(weapon.Name) }
            </Button>
    )
}