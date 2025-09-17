import { BaseAvatar } from "@interknot/types"
import { Group, Image, Tooltip } from "@mantine/core"
import "./Team.css"
import { useSettings } from "@components/SettingsProvider"

function TeamMember({ ref, avatar }: { ref?: any, avatar: BaseAvatar }) {
    return (
        <div className="member" ref={ref}>
            <Image h="100%" src={avatar.CircleIconUrl.replace("Circle", "Select")} alt={avatar.Name} />
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