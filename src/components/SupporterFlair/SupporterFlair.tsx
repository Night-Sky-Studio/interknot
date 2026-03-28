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
        [AccountLevel.PastSupporter,        () => ({ from: "gray", to: "blue" })],
        [AccountLevel.CertifiedProxy,       () => ({ from: "#28991a", to: "#a4db44" })],
        [AccountLevel.SeniorProxy,          () => ({ from: "#2938e2", to: "#36a0fc" })],
        [AccountLevel.EliteProxy,           () => ({ from: "#bd25fc", to: "#6c16e4" })],
        [AccountLevel.LegendaryProxy,       () => ({ from: "#ffd317", to: "#ee8a16" })],
        [AccountLevel.DiscordServerBooster, () => ({ from: "#b05fff", to: "#f787c7" })],
        [AccountLevel.EnkaSupporter,        () => ({ from: "#334456", to: "#819cab" })],
        [AccountLevel.Admin,                () => ({ from: "red", to: "indigo" })],
        () => ({ from: "gray", to: "dark.6" }),
    ])

    return (
        <Badge variant="gradient" gradient={color} >{label}</Badge>
    )
}