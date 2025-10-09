import { DamageDistributionMemoized } from "../DamageDistribution/DamageDistribution"
import { Center } from "@mantine/core"
import LeaderboardsList from "@components/LeaderboardsList/LeaderboardsList"
import { useLeaderboards } from "@components/LeaderboardProvider"

interface IBuildInfoProps {
    mode: number
}

export default function BuildInfo({ mode }: IBuildInfoProps): React.ReactElement {
    const { entries, leaderboards, highlightId } = useLeaderboards()

    return (<Center>
        { mode === 0 && <DamageDistributionMemoized entries={entries} initialLeaderboardId={highlightId} /> }
        { mode === 1 && <div>Not implemented yet</div> }
        { mode === 2 && <LeaderboardsList leaderboards={leaderboards} entries={entries} highlightId={highlightId} /> }
    </Center>)
}