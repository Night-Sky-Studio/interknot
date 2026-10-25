import { getAssaultLeaderboard, getAssaultLeaderboardUsers, getAssaultLeaderboardUsersCount } from "@api/data"
import FilterSelector from "@components/FilterSelector/FilterSelector"
import { ServerChip, UserHeaderMemoized } from "@components/UserHeader/UserHeader"
import { useSettings } from "@components/SettingsProvider"
import { useQueryParams } from "@/hooks/useQueryParams"
import { type Buff } from "@interknot/types"
import {
    Alert,
    Anchor,
    Avatar,
    Badge,
    Button,
    Card,
    Center,
    Flex,
    Grid,
    Group,
    Image,
    Loader,
    LoadingOverlay,
    Pagination,
    Select,
    Stack,
    Title,
    Text,
    Collapse,
    Divider,
    UnstyledButton
} from "@mantine/core"
import { IconChevronDown, IconChevronUp, IconInfoCircle } from "@tabler/icons-react"
import { DataTable } from "mantine-datatable";
import { useCallback, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAsync } from "react-use"
import "./styles/AssaultLeaderboardsDetailsPage.css"
import GameText from "@components/GameText"
import { useDisclosure } from "@mantine/hooks"
import { ZenlessIcon } from "@components/icons/Icons"
import { EndGameStar } from "@components/icons"

function isLive(from: string, to: string): boolean {
    const fromDate = new Date(from).getTime(),
          toDate = new Date(to).getTime(),
          now = new Date().getTime()

    return fromDate <= now && now <= toDate
}

function formatDuration(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000))
    const d = Math.floor(total / 86400)
    const h = Math.floor((total % 86400) / 3600)
    const m = Math.floor((total % 3600) / 60)
    if (d > 0) return `${d}d ${h}h`
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
}

function StarRating({ score }: { score: number }): React.ReactElement {
    return (<Group wrap="nowrap" gap="4px" bg="dark.9" p="4px" bdrs="16px">
        <EndGameStar height={24} state={ score >= 10000 ? score >= 40000 ? "radiant" : "active" : "regular" } />
        <EndGameStar height={24} state={ score >= 20000 ? score >= 50000 ? "radiant" : "active" : "regular" } />
        <EndGameStar height={24} state={ score >= 30000 ? score >= 60000 ? "radiant" : "active" : "regular" } />
    </Group>)
}

export default function AssaultLeaderboardsDetailsPage(): React.ReactElement {
    const navigate = useNavigate()
    const { getLocalString } = useSettings()

    const { id } = useParams()

    const [{ cursor, limit, ...query }, setQueryParams] = useQueryParams()
    const limitNum = useMemo(() => Number(limit) || 20, [limit])
    const filterQuery = useMemo(() => query, [JSON.stringify(query)])

    const leaderboardState = useAsync(async () => {
        return await getAssaultLeaderboard(Number(id))
    }, [id])
    const leaderboard = useMemo(() => leaderboardState.value?.data,
        [leaderboardState.value?.data, id])

    const leaderboardUsersState = useAsync(async () => {
        return await getAssaultLeaderboardUsers(Number(id), {
            cursor: cursor?.toString(),
            limit: limitNum,
            filter: filterQuery as Record<string, string>
        })
    }, [id, cursor, limit, filterQuery])
    const leaderboardUsers = useMemo(() => leaderboardUsersState.value?.data ?? [],
        [leaderboardUsersState.value?.data])

    const totalCountState = useAsync(async () => await getAssaultLeaderboardUsersCount(Number(id), leaderboardUsersState.value?.totalCountHash),
        [id, leaderboardUsersState.value?.totalCountHash])
    const totalCount = useMemo(() => totalCountState.value?.data, [totalCountState.value?.data])

    const [page, setPage] = useState<number | undefined>(cursor === undefined ? 1 : undefined)

    const enemyName = useMemo(() => {
        if (!leaderboard) return "Loading..."
        return getLocalString(leaderboard.EnemyName)
    }, [leaderboard, getLocalString])

    const getName = useCallback(() => {
        if (!leaderboard) return "Loading..."
        return `${leaderboard.GameVersion} - ${enemyName}`
    }, [leaderboard, enemyName])

    /** How long is left in the current run, or when it ended. */
    const remaining = useMemo(() => {
        if (!leaderboard) return null
        const from = new Date(leaderboard.StartDate).getTime()
        const to = new Date(leaderboard.EndDate).getTime()
        const now = Date.now()

        if (now < from) return `Starts in ${formatDuration(from - now)}`
        if (now > to) return `Ended ${new Date(to).toLocaleDateString()}`
        return `Ends in ${formatDuration(to - now)}`
    }, [leaderboard])

    const BuffGroup = ({ title, buffs }: { title: string, buffs: Buff[] }) => {
        if (buffs.length === 0) return null

        const [expanded, { toggle }] = useDisclosure(true)

        return (
            <Stack gap="xs" c="white">
                <Button variant="transparent" c="white" onClick={toggle}
                    rightSection={expanded ? <IconChevronUp /> : <IconChevronDown />}>
                    <Title order={5}>{title}</Title>
                </Button>
                <Collapse in={expanded}>
                    <>
                        { buffs.map((b, i) => (<>
                            <Stack key={`${b.Description}_${i}`} gap="0">
                                {b.Title && <Title order={6}>{getLocalString(b.Title)}</Title>}
                                {/* <Text fz="12pt">{getLocalString(b.Description)}</Text>  */}
                                <GameText gap="0" text={getLocalString(b.Description)} />
                            </Stack>
                            
                            { i !== buffs.length - 1 && <Divider my="lg" /> }
                        </>)) }
                    </>
                </Collapse>
            </Stack>
        )
    }

    return (<>
        <title>{`${getName()} | Inter-Knot`}</title>
        <Stack>
            {(leaderboardState.error || leaderboardUsersState.error) &&
                <Alert variant="light" color="red" title="Failed to load users" icon={<IconInfoCircle />}>
                    <Text ff="monospace">Error: {leaderboardState.error?.message ?? leaderboardUsersState.error?.message}</Text>
                </Alert>
            }
            {leaderboard &&
                <Card withBorder>
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, sm: "content" }}>
                            <Card withBorder p="0" bd="2px solid dark" shadow="md" bg="dark">
                                <Image className="enemy-img" src={leaderboard.EnemyImageUrl} alt={enemyName} />
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: "auto" }}>
                            <Stack c="white">
                                <Group gap="sm">
                                    <Title order={2}>{enemyName}</Title>
                                    {isLive(leaderboard.StartDate, leaderboard.EndDate) &&
                                        <Badge c="black">Live</Badge>
                                    }
                                </Group>
                                <Stack gap="0">
                                    <Text fz="12pt">Version {leaderboard.GameVersion}</Text>
                                    <Text fz="12pt">
                                        {new Date(leaderboard.StartDate).toLocaleString()}
                                        {" - "}
                                        {new Date(leaderboard.EndDate).toLocaleString()}
                                    </Text>
                                    <Text fz="12pt">
                                        {remaining}
                                    </Text>
                                </Stack>
                                {leaderboard.EnemyWeaknesses.length > 0 &&
                                    <Group gap="xs">
                                        <Title order={5}>Weaknesses</Title>
                                        {leaderboard.EnemyWeaknesses.map(w =>
                                            <Badge key={w} px="4px" radius="sm" color="dark"
                                                leftSection={<ZenlessIcon size={14} elementName={w} />}>
                                                    {getLocalString(w)}
                                            </Badge>
                                        )}
                                    </Group>
                                }
                                {leaderboard.EnemyResistances.length > 0 &&
                                    <Group gap="xs">
                                        <Title order={5}>Resistances</Title>
                                        {leaderboard.EnemyResistances.map(w =>
                                            <Badge key={w} px="4px" radius="sm" color="dark"
                                                leftSection={<ZenlessIcon size={14} elementName={w} />}>
                                                    {getLocalString(w)}
                                            </Badge>
                                        )}
                                    </Group>
                                }
                            </Stack>
                        </Grid.Col>
                    </Grid>

                    {(leaderboard.LayerBuffs.length > 0 || leaderboard.SelectableBuffs.length > 0) &&
                        <Grid gutter="xl" mt="xl">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <BuffGroup title="Layer Buffs" buffs={leaderboard.LayerBuffs} />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <BuffGroup title="Selectable Buffs" buffs={leaderboard.SelectableBuffs} />
                            </Grid.Col>
                        </Grid>
                    }
                </Card>
            }

            {(leaderboardState.loading || leaderboardUsersState.loading) &&
                <Center>
                    <Loader />
                </Center>
            }

            <FilterSelector
                exclude={["character_id", "set_id", "main_stat_id",
                    "full_set", "partial_sets", "rarity", "onlyPrimary",
                    "weapon_id", "rarity", "weapon_refinement_level", "mindscape_level" ]}
                value={Object.entries(filterQuery).flatMap(([k, v]) => {
                    if (v === undefined) return []
                    return v.toString().split(",").map(s => `${k}:${s}`)
                })}
                onFilterApply={(val) => {
                    const q: Record<string, string> = {}
                    val.forEach(v => {
                        const add = (g: string, s: string) => {
                            if (q[g]) {
                                q[g] += `,${s}`
                            } else {
                                q[g] = s
                            }
                        }
                        const [g, val] = v.split(":")
                        switch (g) {
                            case "disc_set":
                                add("partial_sets", val)
                                add("full_set", val)
                                break
                            case "prop_id":
                                break
                            default:
                                add(g, val)
                                break
                        }
                    })

                    setQueryParams((prev) => ({ cursor: undefined, limit: prev.limit, ...q }), true)
                    setPage(1)
                }} />
            { leaderboardUsersState.value && <>
                    <Card withBorder p="0">
                        <Stack>
                            <LoadingOverlay visible={leaderboardUsersState.loading} zIndex={9}
                                overlayProps={{ radius: "sm", blur: 2 }} />

                            <DataTable
                                highlightOnHover
                                minHeight={144}
                                className="data-table dt-header"
                                idAccessor="Profile.Uid"
                                rowStyle={() => ({
                                    height: "64px",
                                })}
                                rowClassName={(entry) => entry.IsBanned ? "assault-row-banned" : undefined}
                                columns={[
                                    {
                                        accessor: "Rank",
                                        title: "#",
                                        width: "7ch",
                                        cellsClassName: "assault-rank-cell",
                                        cellsStyle: () => ({ maxWidth: "7ch" }),
                                        render: (entry) => <>
                                            {entry.IsBanned 
                                                ? <>
                                                    <Text className="table-name-display">-</Text> 
                                                    <Text className="table-name-local">{entry.Rank}</Text> 
                                                </>
                                                : <Text>{entry.Rank}</Text> 
                                            }
                                        </>
                                    },
                                    {
                                        accessor: "Profile",
                                        title: "User",
                                        // Namecard is absolutely positioned against the <td>: percentage
                                        // heights don't resolve for in-flow children of table cells.
                                        cellsClassName: "assault-user-cell",
                                        render: (entry) => (<>
                                            <div className="assault-user-namecard">
                                                <img src={entry.Profile.NamecardUrl} alt="" />
                                            </div>
                                            <Group className="assault-user-content" gap="sm" wrap="nowrap">
                                                <ServerChip uid={entry.Profile.Uid.toString() ?? ""} />
                                                <Title className="user-info" order={6}>IL {entry.Profile.Level}</Title>
                                                <Avatar src={entry.Profile.ProfilePictureUrl} size="md" />
                                                <Anchor c="gray" style={{ whiteSpace: "nowrap" }}
                                                        href={`/profile/${entry.Profile.Uid}`}
                                                        onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    navigate(`/profile/${entry.Profile.Uid}`)
                                                }}>
                                                    <Title order={5} className="namecard-nickname" title={entry.Profile.Nickname}>
                                                        {entry.Profile.Nickname}
                                                    </Title>
                                                </Anchor>
                                                {entry.IsBanned &&
                                                    <Badge color="red">Sus</Badge>
                                                }
                                            </Group>
                                        </>)
                                    },
                                    {
                                        accessor: "TotalValue",
                                        title: "Score",
                                        cellsStyle: () => ({
                                            width: "180px",
                                            background: "rgba(0 0 0 / 25%)",
                                            zIndex: 1
                                        }),
                                        render: (entry) => (
                                            <Group gap="xs">
                                                <StarRating score={entry.TotalValue} />
                                                <Text fw={600} style={{
                                                    textDecoration: entry.IsBanned ? "line-through" : undefined
                                                }}>{entry.TotalValue.toLocaleString()}</Text>
                                            </Group>
                                        )
                                    }
                                ]}
                                rowExpansion={{
                                    allowMultiple: true,
                                    content: ({ record: entry }) => (
                                        <Center w="100%" p="md">
                                            <UnstyledButton maw="640px" w="100%" component="a" className="profile-button"
                                                onClick={() => {
                                                    navigate(`/profile/${entry.Profile.Uid}`)
                                                }}>
                                                <UserHeaderMemoized user={entry.Profile} />
                                            </UnstyledButton>
                                        </Center>
                                    )
                                }}
                                records={leaderboardUsers} />

                            <Flex mb="1rem" mx="1rem" justify="space-between" align="center" wrap="wrap">
                                <div style={{ width: "25%" }} />
                                <Group>
                                    <Pagination.Root total={totalCount ? Math.ceil(totalCount / limitNum) : 1}
                                        onFirstPage={() => {
                                            setPage(1)
                                            setQueryParams({ cursor: undefined })
                                        }}
                                        onLastPage={() => {
                                            setPage(totalCount ? Math.ceil(totalCount / limitNum) : 1)
                                            setQueryParams({ cursor: "gte:score=0;uid=0" })
                                        }}
                                        onNextPage={() => {
                                            setPage((p) => p ? p + 1 : p)
                                            if (cursor?.includes("gte:")) {
                                                setQueryParams((prev) => ({ ...prev, cursor: prev.cursor?.toString()?.replace("gte", "lte") }))
                                            } else {
                                                setQueryParams({ cursor: leaderboardUsersState.value?.cursor })
                                            }
                                        }}
                                        onPreviousPage={() => {
                                            setPage((p) => p ? p - 1 : p)
                                            if (page === 1 || leaderboardUsers.length === 0) {
                                                setQueryParams({ cursor: undefined })
                                            } else {
                                                setQueryParams({ cursor: `gte:score=${leaderboardUsers[0].TotalValue};uid=${leaderboardUsers[0].Profile.Uid}` })
                                            }
                                        }}>
                                        <Group gap="xs">
                                            <Pagination.First disabled={page === 1} />
                                            <Pagination.Previous disabled={page === 1} />
                                            <Button variant="filled" autoContrast>{page ?? "??"}</Button>
                                            <Pagination.Next disabled={!leaderboardUsersState.value?.hasNextPage} />
                                            <Pagination.Last disabled={!leaderboardUsersState.value?.hasNextPage} />
                                        </Group>
                                    </Pagination.Root>
                                    <Select w="128px"
                                        data={[20, 50].map((i) => ({ value: `${i}`, label: `${i} / page` }))}
                                        value={limitNum.toString()}
                                        onChange={(value) => {
                                            if (value) {
                                                setPage(1)
                                                setQueryParams({ cursor: undefined, limit: value })
                                            }
                                        }} />
                                </Group>
                                { !page &&
                                    <Text mr="1rem">Showing unknown page of {totalCount ?? "unknown count"}</Text>
                                }
                                { page &&
                                    <Text mr="1rem">Showing {limitNum * (page - 1) + 1} - {totalCount ? Math.min(totalCount, limitNum * page) : "?"} of {totalCount ?? "unknown count"}</Text>
                                }
                            </Flex>
                        </Stack>
                    </Card>
                </>
            }
        </Stack>
    </>)
}
