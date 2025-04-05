import { BaseAvatar, BaseWeapon } from "@interknot/types"
import { Group, UnstyledButton, Image, Title, Stack, Popover, Button } from "@mantine/core"
import "./styles/LeaderboardButton.css"
import { useSettings } from "./SettingsProvider"
import { useDisclosure } from "@mantine/hooks"
import { useNavigate } from "react-router"

interface ILeaderboardButtonProps {
    id: number
    agent: BaseAvatar
    weapon: BaseWeapon
    name: string
    rank: number
    total: number
    type: number
    onClick?: () => void
}

export function LeaderboardButton({ id, agent, weapon, name, rank, total, type, onClick }: ILeaderboardButtonProps) {
    const navigate = useNavigate()

    const { getLocalString } = useSettings()

    const [opened, { toggle, close }] = useDisclosure(false)

    return (
        <Popover opened={opened} withArrow onDismiss={close}>
            <Popover.Target>
                <UnstyledButton className="lb-button" data-type={type} onClick={() => {
                    toggle()
                    onClick?.()
                }}>
                    <Group gap="4px" wrap="nowrap">
                        <Group className="lb-avatar" wrap="nowrap" gap="0">
                            <Image src={agent.CircleIconUrl} alt={getLocalString(agent.Name)} />
                            <Image src={weapon.ImageUrl} alt={getLocalString(weapon.Name)} />
                        </Group>
                        <Stack gap="0px" className="lb-info">
                            <Title order={6} fz="12px">{name}</Title>
                            <Title order={6} fz="14px" ff="zzz-jp">Top {((rank / total) * 100).toFixed(1)}%</Title>
                            <Title order={6} fz="10px" ff="zzz-jp">{rank} / {total}</Title>
                        </Stack>
                    </Group>
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
                <Button onClick={() => navigate(`/leaderboards/${id}`)}>Open leaderboard</Button>
            </Popover.Dropdown>
        </Popover>
    )
}