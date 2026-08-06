import { Stack } from "@mantine/core"
import AssaultLeaderboards from "./leaderboards/AssaultLeaderboards"
import Leaderboards from "./leaderboards/Leaderboards"

export default function LeaderboardsPage(): React.ReactElement {
    return (<>
        <title>Leaderboards | Inter-Knot</title>
        <Stack>
            <AssaultLeaderboards />

            <Leaderboards />
        </Stack>
    </>)
}