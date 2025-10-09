
import { nFormatter, toFixedCeil } from "@/extensions/NumberExtensions"
import { BaseLeaderboardEntry, LeaderboardList } from "@interknot/types"
import { Card, Group, Text, Image, Table, ScrollArea } from "@mantine/core"
import { useSettings } from "@components/SettingsProvider"
import { Team } from "@components/Team/Team"
import "./LeaderboardsList.css"

interface ILeaderboardsListProps {
    leaderboards: LeaderboardList[]
    entries: BaseLeaderboardEntry[]
    highlightId?: number
}

export default function LeaderboardsList({ leaderboards, entries, highlightId }: ILeaderboardsListProps): React.ReactElement {
    const { decimalPlaces, getLocalString } = useSettings()

    // 

    const LeaderboardRow = ({ entry }: { entry: BaseLeaderboardEntry }) => {
        const leaderboard = leaderboards.find(lb => lb.Id === entry.Leaderboard.Id)
        return (
            <Table.Tr className={highlightId === entry.Leaderboard.Id ? "highlight": ""}>
                <Table.Td>
                    <Text>{entry.Rank}<Text component="span" c="dimmed"> / {nFormatter(entry.Leaderboard.Total)}</Text></Text>
                </Table.Td>
                <Table.Td>
                    <Text>top {toFixedCeil((entry.Rank / entry.Leaderboard.Total) * 100, decimalPlaces)}%</Text>
                </Table.Td>
                <Table.Td>
                    <Group gap="4px" wrap="nowrap">
                        <Image src={entry.Leaderboard.Weapon.ImageUrl} h="24px" />
                        <Text>{getLocalString(entry.Leaderboard.Weapon.Name)}</Text>
                    </Group>
                </Table.Td>
                <Table.Td>
                    { leaderboard && <Team team={[entry.Leaderboard.Character, ...leaderboard.Team]} /> }
                </Table.Td>
                <Table.Td>
                    <Text>{entry.Leaderboard.FullName}</Text>
                </Table.Td>
                <Table.Td>
                    <Text fw="bold">{toFixedCeil(entry.TotalValue, 0)}</Text>
                </Table.Td>
            </Table.Tr>
        )
    }

    return (
        <Card p="0" withBorder bg="dark.7">
            <ScrollArea>
                <Table className="lb-list" miw="280px" maw="100%">
                    <Table.Tbody>
                        {
                            entries.sort((a, b) => a.Rank - b.Rank).map(entry => <LeaderboardRow entry={entry} key={`lb-entry-${entry.Leaderboard.Id}`} />)
                        }
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Card>
    )
}