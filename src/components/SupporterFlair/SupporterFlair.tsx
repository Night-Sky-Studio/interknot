import { AccountLevel, match } from "@interknot/types"
import { Badge } from "@mantine/core"

export interface ISupporterFlairProps {
    level: AccountLevel
}

export default function SupporterFlair({ level }: ISupporterFlairProps): React.ReactElement {
    const label = match(level, [
        [AccountLevel.Regular, "Regular"],
        [AccountLevel.PastSupporter, "Past Supporter"],
        [AccountLevel.CertifiedProxy, "Certified Proxy"],
        [AccountLevel.SeniorProxy, "Senior Proxy"],
        [AccountLevel.EliteProxy, "Elite Proxy"],
        [AccountLevel.LegendaryProxy, "Legendary Proxy"],
        [AccountLevel.DiscordServerBooster, "Discord Server Booster"],
        [AccountLevel.EnkaSupporter, "Enka Supporter"],
        [AccountLevel.Admin, "Administrator"],
        () => "Unknown"
    ])

    const color = match(level, [
        [AccountLevel.DiscordServerBooster, () => ({ from: "#b05fff", to: "#f787c7" })],
        () => ({ from: 'gray', to: 'dark' }),
    ])

    return (
        <Badge variant="gradient" gradient={color} >{label}</Badge>
    )
}