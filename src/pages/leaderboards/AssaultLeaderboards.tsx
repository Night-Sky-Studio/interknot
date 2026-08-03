import { getAssaultLeaderboards } from "@/api/data"
import { useSettings } from "@/components/SettingsProvider"
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
                    To participate in these leaderboards, you must have <b>AT LEAST 3</b> characters in your Profile
                    and have a Hardcore Deadly Assault medal on your profile.
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
                                    title: "Name",
                                    render: (leaderboard) => {
                                        return (
                                            <Group gap="xs">
                                                <Image h="32px" src={leaderboard.EnemyIconUrl} 
                                                    alt={leaderboard.EnemyName} />
                                                <Anchor href={`/leaderboards/assault/${leaderboard.Id}`} onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    navigate(`/leaderboards/assault/${leaderboard.Id}`)
                                                }} c="inherit" fz="inherit">
                                                    <Group gap="xs">
                                                        <Badge bg="dark">{leaderboard.GameVersion}</Badge>
                                                        {getLocalString(leaderboard.EnemyName)}
                                                    {
                                                        isLive(leaderboard.StartDate, leaderboard.EndDate) 
                                                            && <Badge c="black">Live</Badge>
                                                    }
                                                    </Group>
                                                </Anchor>

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
                            // rowExpansion={{
                            //     allowMultiple: true,
                            //     content: ({ record: leaderboard }) => (
                            //         <Flex w="100%" justify="space-evenly" align="center">
                            //             <Stack p="md" gap="xs" align="flex-start">
                            //                 <Text fz="sm" c="dimmed">Weapons</Text>
                            //                 {
                            //                     [leaderboard, ...leaderboard.Children].map((child) => (
                            //                         <WeaponButton key={child.Id} id={child.Id} 
                            //                             weapon={child.Weapon} refinementLevel={child.Weapon.Rarity === 4 ? 1 : 5} />
                            //                     ))
                            //                 }
                            //             </Stack>
                            //             <Stack p="md" gap="xs">
                            //                 <Text fz="sm" c="dimmed">Team</Text>
                            //                 <Team h="96px" team={leaderboard.Team} />
                            //             </Stack>
                            //         </Flex>
                            //     )
                            // }} 
                            />
                    </Stack>
                </Card>
            }
        </Stack>
    </>)
}