import { useNavigate, useParams, useSearchParams } from "react-router"
import { useAsync } from "react-use"
import { getLeaderboard, getLeaderboardDmgDistribution, getLeaderboardUsers } from "../api/data"
import { Alert, Card, Center, Group, Loader, Pagination, Select, Stack, Table, Text, Title, Image, SimpleGrid } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import CritCell from "../components/CritCell"
import { LineChart } from "@mantine/charts"
import WeaponButton from "../components/WeaponButton"
import { useMemo } from "react"
import { Character, Property } from "@interknot/types"
import PropertyCell from "../components/PropertyCell"

export default function LeaderboardDetailPage(): React.ReactElement {
    const navigate = useNavigate()

    const { id } = useParams()

    const [searchParams, _] = useSearchParams()

    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "10")

    const setPage = (page: number) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set("page", page.toString())
        navigate(`?${newParams.toString()}`, { replace: false })
    }

    const setLimit = (limit: number) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set("limit", limit.toString())
        navigate(`?${newParams.toString()}`, { replace: false })
    }

    const leaderboardState = useAsync(async () => {
        return await getLeaderboard(Number(id))
    }, [id])

    const leaderboardUsersState = useAsync(async () => {
        return await getLeaderboardUsers(Number(id), Number(page), Number(limit))
    }, [id, page, limit])

    const currentLeaderboard = useMemo(() => leaderboardState.value?.find(lb => lb.Id === Number(id)), 
        [leaderboardState.value, id])

    const leaderboardDistributionState = useAsync(async () => {
        return await getLeaderboardDmgDistribution(Number(id))
    }, [id])

    const stats = (c: Character) => {
        const result: Property[] = []
        let skippedStats = 0
        for (const prodId of c.DisplayProps) {
            const stat = c.Stats.find(p => p.Id === prodId)
            if (stat?.Value === 0) {
                skippedStats++
                if (c.DisplayProps.length - skippedStats >= 4)
                    continue
            }
            if (result.length >= 4)
                break
            if (stat) {
                result.push(stat)
            }
        }
        return result
    }

    return (<>
        <title>{`${currentLeaderboard?.FullName} | Inter-Knot`}</title>
        <Stack>
            {leaderboardUsersState.error &&
                <Alert variant="light" color="red" title="Failed to load users" icon={<IconInfoCircle />}>
                    <Text ff="monospace">Error: {leaderboardUsersState.error.message}</Text>
                </Alert>
            }
            {leaderboardState.value && currentLeaderboard &&
                <Card withBorder>
                    <SimpleGrid cols={2} spacing="xl">
                        <Center>
                            {leaderboardDistributionState.error && 
                                <Alert variant="light" 
                                    color={leaderboardDistributionState.error.message.includes("425") ? "orange" : "red"} 
                                    title="Failed to load distribution" icon={<IconInfoCircle />}>
                                    <Text ff="monospace">Error {leaderboardDistributionState.error.message}</Text>
                                </Alert>
                            }
                            {leaderboardDistributionState.value &&
                                <LineChart h="300px" w="100%"
                                    data={leaderboardDistributionState.value} 
                                    series={[{ name: "value", color: "blue.6" }]}
                                    dataKey="top" 
                                    tickLine="xy"
                                    gridAxis="xy"
                                    curveType="natural" />
                            }
                        </Center>
                        <Stack>
                            <Title order={2}>{currentLeaderboard?.FullName}</Title>
                            {currentLeaderboard?.Description &&
                                <Text fz="12pt">{currentLeaderboard?.Description}</Text>
                            }
                            <Group gap="xs">
                                <Text>
                                    Rotation: 
                                    {` ${currentLeaderboard?.Rotation.map(r => r.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")).join(", ")}`}
                                </Text>
                            </Group>
                            <Group gap="xs">
                                <Text>Weapons: </Text>
                                {
                                    leaderboardState.value.map(lb => {
                                        return (
                                            <WeaponButton id={lb.Id} weapon={lb.Weapon} selected={lb.Id === Number(id)} />
                                        )
                                    })
                                }
                            </Group>
                        </Stack>
                    </SimpleGrid>
                </Card>
            }
            {leaderboardUsersState.loading && !leaderboardUsersState.value &&
                <Center>
                    <Loader />
                </Center>
            }
            {leaderboardUsersState.value && <>
                <Card withBorder p="0">
                    <Table stickyHeader>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Owner</Table.Th>
                                {/* <Table.Th>Character</Table.Th> */}
                                <Table.Th>Drive Discs</Table.Th>
                                <Table.Th>Crit Ratio</Table.Th>
                                <Table.Th className="is-narrow">Stats</Table.Th>
                                <Table.Th className="is-narrow"></Table.Th>
                                <Table.Th className="is-narrow"></Table.Th>
                                <Table.Th className="is-narrow"></Table.Th>
                                <Table.Th bg="rgba(0 0 0 / 25%)">Total Value</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {leaderboardUsersState.value.items.map(user => {
                                return (
                                    <Table.Tr key={user.Profile.Uid} onClick={() => navigate(`/user/${user.Profile.Uid}?openedId=${user.Character.Id}`)}>
                                        <Table.Td w="64px">{user.Rank}</Table.Td>
                                        <Table.Td w="30%">
                                            <Group gap="sm">
                                                <Image src={user.Profile.ProfilePictureUrl} h="32px" />
                                                <Text>{user.Profile.Nickname}</Text>
                                            </Group>
                                        </Table.Td>
                                        {/* <Table.Td>
                                            <Group gap="sm">
                                                <Image src={user.Character.CircleIconUrl} h="32px" />
                                                <Text>{getLocalString(user.Character.Name)}</Text>
                                                <div className="chip">Lv. {user.Character.Level}</div>
                                            </Group>
                                        </Table.Td> */}
                                        <Table.Td>
                                            <Group gap="8px">
                                                {
                                                    user.Character.DriveDisksSet.map(set => {
                                                        return (
                                                            <Group key={set.Set.Id} gap="-14px" align="flex-end">
                                                                <Image src={set.Set.IconUrl} h="32px" />
                                                                <Text size="10pt">{set.Count}</Text>
                                                            </Group>
                                                        )
                                                    })
                                                }
                                            </Group>
                                        </Table.Td>
                                        <Table.Td w="160px" bg="rgba(0 0 0 / 15%)">
                                            <CritCell cr={user.Character.Stats.find(p => p.Id === 20101)?.formatted?.replace("%", "") ?? ""}
                                                cd={user.Character.Stats.find(p => p.Id === 21101)?.formatted?.replace("%", "") ?? ""} 
                                                cv={user.Character.CritValue} />
                                        </Table.Td>
                                        {
                                            stats(user.Character).map(prop => <PropertyCell className="is-narrow" key={prop.Id} prop={prop} />)
                                        }
                                        <Table.Td w="128px" bg="rgba(0 0 0 / 25%)">
                                            <Text fz="12pt" fw={600}>{Math.round(user.TotalValue).toLocaleString()}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            })}
                        </Table.Tbody>
                    </Table>
                </Card>
                <Group justify="center" gap="xs">
                    <Pagination withControls autoContrast 
                        total={leaderboardUsersState.value.totalPages} 
                        value={page} onChange={setPage} />
                    <Select w="128px"
                        data={[10, 30, 60, 100].map((i) => ({ value: `${i}`, label: `${i} / page` }))}
                        value={limit.toString()}
                        onChange={(value) => {
                            value && setLimit(Number(value))
                        }} />
                </Group>
            </>}
        </Stack>
    </>)
}