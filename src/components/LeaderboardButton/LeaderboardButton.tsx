import { BaseAvatar, BaseWeapon } from "@interknot/types"
import { Group, UnstyledButton, Image, Title, Stack, Popover, Button, Tooltip } from "@mantine/core"
import "./LeaderboardButton.css"
import { useSettings } from "@components/SettingsProvider"
import { useDisclosure } from "@mantine/hooks"
import { useNavigate } from "react-router"
import { useMemo } from "react"
import { toFixedCeil } from "@extensions/NumberExtensions"

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
    // https://stackoverflow.com/a/9462382/10990079
    const nFormatter = (num: number, digits: number) => {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ]
        const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
        const item = lookup.findLast(item => num >= item.value)
        return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0"
    }

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