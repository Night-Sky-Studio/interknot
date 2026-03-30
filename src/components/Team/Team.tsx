import { BaseAvatar } from "@interknot/types"
import { Group, Image, Tooltip } from "@mantine/core"
import "./Team.css"
import { useSettings } from "@components/SettingsProvider"
import { useMemo } from "react"
import { useBackend } from "@components/BackendProvider.tsx"

function TeamMember({ ref, avatar }: { ref?: any, avatar: BaseAvatar }) {
    // FIXME: needs proper img replacing solution
    const { state } = useBackend()
    const hasDoro = useMemo(() => state?.data?.events?.doro?.includes(avatar.Id) ?? false,
        [state?.data?.events?.doro, avatar.Id])
    const url = useMemo(() =>
        hasDoro
            ? avatar.ImageUrl.replace("enka.network", "cdn.interknot.space/aprilfools")
            : avatar.CircleIconUrl.replace("Circle", "Select"),
        [hasDoro, avatar.CircleIconUrl, avatar.ImageUrl])
    return (
        <div className="member" ref={ref}>
            <Image h="100%" ml={hasDoro ? "1rem" : undefined} src={url} alt={avatar.Name} />
        </div>
    )
}

export function Team({ team, h }: { team: BaseAvatar[], h?: string }) {
    const { getLocalString } = useSettings()
    return (
        <Group gap="4px" h={h ?? "32px"} wrap="nowrap">
            {team.map((avatar) => (
                <Tooltip key={avatar.Id} label={getLocalString(avatar.Name)} portalProps={{ reuseTargetNode: true }}>
                    <TeamMember avatar={avatar} />
                </Tooltip>
            ))}
            {Array.from({ length: 3 - team.length }, (_, i) => (
                <Tooltip key={i} label={"Any agent"} portalProps={{ reuseTargetNode: true }}>
                    <div className="member empty-member" />
                </Tooltip>
            ))}
        </Group>
    )
}