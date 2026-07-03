import { useAsyncRetry } from "react-use"
import { getLeaderboards } from "../api/data"
import { Card, Center, Group, Image, Loader, Stack, Text, Title, Alert, Anchor, Flex } from "@mantine/core"
import { ProfessionIcon, ZenlessIcon } from "../components/icons/Icons"
import { IconInfoCircle } from "@tabler/icons-react"
import { useNavigate } from "react-router"
import { Team } from "@components/Team/Team"
import WeaponButton from "@components/WeaponButton"
import { useMemo } from "react"
// import { useBackend } from "@components/BackendProvider.tsx"
import { DataTable } from "mantine-datatable"

export default function LeaderboardsPage(): React.ReactElement {
    const navigate = useNavigate()

    const leaderboardsState = useAsyncRetry(async () => {
        return await getLeaderboards({})
    })

    const leaderboards = useMemo(() => leaderboardsState.value?.data?.sort((a, b) => b.Total - a.Total), [leaderboardsState.value])

    // const { state } = useBackend()
    // const doro = useMemo(() => state?.data?.events?.doro ?? [], [state?.data?.events?.doro])
    // const doroMode = useMemo(() => doro.length > 0, [doro.length])

    return (<>
        <title>Leaderboards | Inter-Knot</title>
        <Stack>
            <Alert variant="light" color="blue" 
                title={<Title order={3}>Leaderboards are meant for comparing Drive Discs strength only!</Title>} icon={<IconInfoCircle />}>
                <Stack>
                <Text>
                    Your mindscape, character, weapon levels and any other upgradable stats
                    are not taken into account when calculating the leaderboard score. Only the Drive Discs
                    and Drive Disc Sets are being used in the calculation.
                </Text>
                <Text>
                    Despite the score being directly related to the damage/daze dealt, it's VERY approximate,
                    should not be taken very seriously and must be treated as a number we pulled out of our asses.
                </Text>
                <Text>
                    You can check the calculations code we use on <Anchor href="https://github.com/Night-Sky-Studio/interknot-calculator" target="_blank">GitHub</Anchor>. 
                    Contributions are welcome!
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
                                    accessor: "FullName",
                                    title: "Name",
                                    render: (leaderboard) => {
                                        return (
                                            <Group gap="xs">
                                                <ZenlessIcon size={24} elementName={leaderboard.Character.ElementTypes[0]} />
                                                <ProfessionIcon size={24} name={leaderboard.Character.ProfessionType} />
                                                <Image h="32px" src={leaderboard.Character.CircleIconUrl} 
                                                    alt={leaderboard.Character.Name} />
                                                <Anchor href={`/leaderboards/${leaderboard.Id}`} onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    navigate(`/leaderboards/${leaderboard.Id}`)
                                                }} c="inherit" fz="inherit">
                                                    {leaderboard.FullName}
                                                </Anchor>
                                            </Group>
                                        )
                                    }
                                },
                                {
                                    accessor: "Weapons",
                                    title: "Weapons",
                                    render: (leaderboard) => (
                                        <Group gap="xs">
                                            {
                                                [leaderboard, ...leaderboard.Children].map((child) => (
                                                    <WeaponButton key={child.Id} id={child.Id} compact
                                                        refinementLevel={child.Weapon.Rarity === 4 ? 1 : 5} 
                                                        weapon={child.Weapon} />
                                                ))
                                            }
                                        </Group>
                                    )
                                },
                                {
                                    accessor: "Team",
                                    title: "Team",
                                    render: (leaderboard) => <Team compact h="36px" team={leaderboard.Team} />
                                },
                                {
                                    accessor: "Total",
                                    title: "Total"
                                }
                            ]} 
                            rowExpansion={{
                                allowMultiple: true,
                                content: ({ record: leaderboard }) => (
                                    <Flex w="100%" justify="space-evenly" align="center">
                                        <Stack p="md" gap="xs" align="flex-start">
                                            <Text fz="sm" c="dimmed">Weapons</Text>
                                            {
                                                [leaderboard, ...leaderboard.Children].map((child) => (
                                                    <WeaponButton key={child.Id} id={child.Id} 
                                                        weapon={child.Weapon} refinementLevel={child.Weapon.Rarity === 4 ? 1 : 5} />
                                                ))
                                            }
                                        </Stack>
                                        <Stack p="md" gap="xs">
                                            <Text fz="sm" c="dimmed">Team</Text>
                                            <Team h="96px" team={leaderboard.Team} />
                                        </Stack>
                                    </Flex>
                                )
                            }} />
                    </Stack>
                </Card>
            }
        </Stack>
    </>)
}