import { BaseAvatar, WeaponData } from "@interknot/types"
import { Group, UnstyledButton, Image, Title, Stack } from "@mantine/core"
import { getLocalString } from "../localization/Localization"
import "./styles/LeaderboardButton.css"

export function LeaderboardButton({ agent, weapon }: { agent: BaseAvatar, weapon: WeaponData }) {
    return (
        <UnstyledButton className="lb-button">
            <Group gap="4px" wrap="nowrap">
                <Group className="lb-avatar" wrap="nowrap" gap="0">
                    <Image src={agent.CircleIconUrl} alt={getLocalString(agent.Name)} />
                    <Image src={weapon.ImageUrl} alt={getLocalString(weapon.Name)} />
                </Group>
                <Stack gap="0px" className="lb-info">
                    <Title order={6} fz="12px">build name</Title>
                    <Title order={6} fz="14px" ff="zzz-jp">Top {((weapon.Rank / weapon.Players) * 100).toFixed(1)}%</Title>
                    <Title order={6} fz="10px" ff="zzz-jp">{weapon.Rank} / {weapon.Players}</Title>
                </Stack>
            </Group>
        </UnstyledButton>
    )
}