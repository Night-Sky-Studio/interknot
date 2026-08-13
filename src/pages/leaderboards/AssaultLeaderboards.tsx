import { getAssaultLeaderboards } from "@/api/data"
import { useSettings } from "@/components/SettingsProvider"
import { url } from "@interknot/types"
import { Alert, Anchor, Card, Center, Group, Loader, Stack, Title, Text, Image, Badge } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import { DataTable } from "mantine-datatable"
import { useMemo } from "react"
import { useNavigate } from "react-router"
import { useAsync } from "react-use"

function isLive(from: string, to: string): boolean {
    const fromDate = new Date(from).getTime(), 
          toDate = new Date(to).getTime(),
          now = new Date().getTime()

    return fromDate <= now && now <= toDate
}

export default function AssaultLeaderboards(): React.ReactElement {
    const navigate = useNavigate()
    const { getLocalString } = useSettings()

    const leaderboardsState = useAsync(getAssaultLeaderboards)
    const leaderboards = useMemo(() => leaderboardsState.value?.data, [leaderboardsState.value?.data])

    return (<>
        <Stack>
            <Alert variant="light" color="blue" 
                title={<Title order={3}>Deadly Assault Leaderboards</Title>} icon={<IconInfoCircle />}>
                <Stack>
                    <Text>
                        All entries go through a very basic anti-cheat system. If you have {(40000).toLocaleString()}+ points, 
                        but have all characters in your profile at M0 or have mostly A-rank characters - you will be flagged. 
                        This check is ran on every profile update, so it is possible to get the sus flag removed. <b>THIS 
                        SYSTEM IS NOT PERFECT</b> and it may change at any moment without any warning. 
                    </Text>
                    <Text>
                        If you think that your clear was unjustly marked as suspicious, use our <Anchor href={url({
                            base: "https://youtrack.interknot.space",
                            path: "form/c84dbde1-02ee-4caf-8c96-bdb862ec50c1",
                            query: {
                                "summary": "Suspicious HC DA clear - <YOUR UID HERE>",
                                "description": `My HC DA clear was marked as suspicious. My proof of the clear is: <YOUR PROOF HERE> (images are supported).`
                            }
                        })} target="_blank">feedback form</Anchor> to send us a report (don't forget to fill in all the fields!).
                    </Text>
                    <Text>
                        To participate in these leaderboards, you must have <b>AT LEAST 2</b> characters in your Profile, 
                        have reached <b>Inter-Knot Level 50</b> and have a <b>Hardcore Deadly Assault Medal</b> with the score 
                        in your profile.
                    </Text>
                
                </Stack>
            </Alert>

            {leaderboardsState.loading && !leaderboardsState.error && 
                <Center>
                    <Loader />
                </Center>
            }
            {leaderboardsState.error &&
                <Alert variant="light" color="red" title="Failed to load leaderboards" icon={<IconInfoCircle />}>
                    <Text ff="monospace">Error: {leaderboardsState.error.message}</Text>
                </Alert>
            }
            {leaderboardsState.value &&
                <Card p="0" withBorder radius="md">
                    <Stack>
                        <DataTable highlightOnHover
                            className="data-table dt-header"
                            records={leaderboards}
                            idAccessor="Id"
                            columns={[
                                {
                                    accessor: "Id",
                                    title: "#",
                                    cellsStyle: () => ({ maxWidth: "2ch" }),
                                    render: (_, index) => <Text fz="inherit">{index + 1}</Text>
                                },
                                {
                                    accessor: "EnemyName",
                                    title: "Deadly Assault",
                                    render: (leaderboard) => {
                                        return (
                                            <Group gap="xs">
                                                <Image h="32px" src={leaderboard.EnemyIconUrl} 
                                                    alt={leaderboard.EnemyName} />
                                                <Group gap="xs">
                                                    <Badge bg="dark">{leaderboard.GameVersion}</Badge>
                                                    <Anchor href={`/leaderboards/assault/${leaderboard.Id}`} onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        navigate(`/leaderboards/assault/${leaderboard.Id}`)
                                                    }} c="inherit" fz="inherit">
                                                        {getLocalString(leaderboard.EnemyName)}
                                                    </Anchor>
                                                    {
                                                        isLive(leaderboard.StartDate, leaderboard.EndDate) 
                                                            && <Badge c="black">Live</Badge>
                                                    }
                                                </Group>

                                            </Group>
                                        )
                                    }
                                },
                                {
                                    accessor: "StartDate",
                                    title: "Start Date",
                                    render: (leaderboard) => <Text>{new Date(leaderboard.StartDate).toLocaleString()}</Text>
                                },
                                {
                                    accessor: "EndDate",
                                    title: "End Date",
                                    render: (leaderboard) => <Text>{new Date(leaderboard.EndDate).toLocaleString()}</Text>
                                },
                                {
                                    accessor: "Count",
                                    title: "Total"
                                }
                            ]}
                            onRowClick={({ event, record }) => {
                                event.stopPropagation()
                                event.preventDefault()
                                navigate(`/leaderboards/assault/${record.Id}`)
                            }}
                        />
                    </Stack>
                </Card>
            }
        </Stack>
    </>)
}