import { Stack } from "@mantine/core"
import AssaultLeaderboards from "./leaderboards/AssaultLeaderboards"
import Leaderboards from "./leaderboards/Leaderboards"
import { useQueryParams } from "@/hooks/useQueryParams"

export default function LeaderboardsPage(): React.ReactElement {
    const [{ mode }] = useQueryParams()

    return (<>
        <title>Leaderboards | Inter-Knot</title>
        <Stack>
            { mode == "debug" &&
                <AssaultLeaderboards />
            }

            <Leaderboards />
        </Stack>
    </>)
}