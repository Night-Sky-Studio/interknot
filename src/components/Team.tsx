import { BaseAvatar } from "@interknot/types"
import { Group, Image } from "@mantine/core"
import "./styles/Team.css"

export function Team({ team, h }: { team: BaseAvatar[], h?: string }) {
    return (
        <Group gap="xs" h={h ?? "32px"}>
            {team.map((avatar) => (
                <Image h="100%" key={avatar.Id} src={avatar.CircleIconUrl} alt={avatar.Name} />
            ))}
            {Array.from({ length: 3 - team.length }, (_, i) => (
                <div key={i} className="empty-member" />
            ))}
        </Group>
    )
}