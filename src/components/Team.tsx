import { BaseAvatar } from "@interknot/types"
import { Group, Image, Tooltip } from "@mantine/core"
import "./styles/Team.css"
import { useSettings } from "./SettingsProvider"

function TeamMember({ ref, avatar }: { ref?: any, avatar: BaseAvatar }) {
    return (
        <div className="member" ref={ref}>
            <Image h="100%" ml="-5px" src={avatar.CircleIconUrl.replace("Circle", "Select")} alt={avatar.Name} />
        </div>
    )
}

export function Team({ team, h }: { team: BaseAvatar[], h?: string }) {
    const { getLocalString } = useSettings()
    return (
        <Group gap="4px" h={h ?? "32px"}>
            {team.map((avatar) => (
                <Tooltip key={avatar.Id} label={getLocalString(avatar.Name)}>
                    <TeamMember avatar={avatar} />
                </Tooltip>
            ))}
            {Array.from({ length: 3 - team.length }, (_, i) => (
                <Tooltip key={i} label={"Any agent"}>
                    <div className="member empty-member" />
                </Tooltip>
            ))}
        </Group>
    )
}