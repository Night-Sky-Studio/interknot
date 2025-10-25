import { BaseAvatar, BaseWeapon } from "@interknot/types"
import { Group, UnstyledButton, Image, Title, Stack, Popover, Button, Tooltip } from "@mantine/core"
import "./LeaderboardButton.css"
import { useSettings } from "@components/SettingsProvider"
import { useDisclosure } from "@mantine/hooks"
import { useNavigate } from "react-router"
import { useMemo } from "react"
import { nFormatter, toFixedCeil } from "@extensions/NumberExtensions"

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

    const { decimalPlaces, getLocalString } = useSettings()

    const [opened, { toggle, close }] = useDisclosure(false)

    const buttonLabel = useMemo(() => {
        switch (type) {
            case 0: return `Leaderboard matches equipped weapon - ${getLocalString(weapon.Name)}`
            case 1: return `Equipped weapon matches leaderboard's weapon's secondary stat - ${getLocalString(weapon.Name)}: ${getLocalString(weapon.SecondaryStat.simpleName)}`
            case 2: return "Equipped weapon doesn't match leaderboard's weapon"
            default: return ""
        }
    }, [type])

    return (
        <Popover opened={opened} withArrow onDismiss={close}>
            <Popover.Target>
                <Tooltip label={buttonLabel} openDelay={500} position="top" w={256} multiline portalProps={{ reuseTargetNode: true }}>
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
                                <Title order={6} fz="14px" ff="zzz-jp">Top {toFixedCeil((rank / total) * 100, decimalPlaces)}%</Title>
                                <Title order={6} fz="10px" ff="zzz-jp">{rank} / {nFormatter(total, 1)}</Title>
                            </Stack>
                        </Group>
                    </UnstyledButton>
                </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
                <Button onClick={() => navigate(`/leaderboards/${id}`)}>Open leaderboard</Button>
            </Popover.Dropdown>
        </Popover>
    )
}