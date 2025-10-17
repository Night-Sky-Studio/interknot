import { useNavigate, useParams } from "react-router"
import { useAsync } from "react-use"
import { getLeaderboard, getLeaderboardDmgDistribution, getLeaderboardUsers, getLeaderboardUsersCount } from "../api/data"
import { Alert, Card, Center, Group, Loader, Pagination, Select, Stack, Text, Title, Image, ActionIcon, Grid, Paper, ColorSwatch, Avatar, Chip, Collapse, Button, Anchor, Flex } from "@mantine/core"
import { IconCheck, IconChevronDown, IconChevronUp, IconCopy, IconInfoCircle } from "@tabler/icons-react"
import CritCell from "@components/cells/CritCell"
import { LineChart } from "@mantine/charts"
import WeaponButton from "@components/WeaponButton"
import { useMemo, useState } from "react"
import { Character, LeaderboardEntry, Property } from "@interknot/types"
import PropertyCell from "@components/cells/PropertyCell"
import DriveDiscsCell from "@components/cells/DriveDiscsCell"
import { useDisclosure } from "@mantine/hooks"
import "./styles/LeaderboardDetailsPage.pcss"
import { useSettings } from "@components/SettingsProvider"
import { Team } from "@components/Team/Team"
import { notifications } from '@mantine/notifications'
import { useQueryParams } from "@/hooks/useQueryParams"
import { DataTable } from "mantine-datatable"
import { ServerChip } from "@/components/UserHeader/UserHeader"

export default function LeaderboardDetailPage(): React.ReactElement {
    const navigate = useNavigate()
    const { id } = useParams()
    const { cvEnabled, getLocalString } = useSettings()

    const [{ cursor, limit, ...query }, setQueryParams] = useQueryParams()
    const limitNum = useMemo(() => Number(limit) || 20, [limit])

    const filterQuery = useMemo(() => query, [JSON.stringify(query)])

    const leaderboardState = useAsync(async () => {
        return await getLeaderboard(Number(id))
    }, [id])
    const relatedLeaderboards = useMemo(() => leaderboardState.value?.data ?? [],
        [leaderboardState.value?.data])
    const leaderboard = useMemo(() => leaderboardState.value?.data?.find(lb => lb.Id === Number(id)), 
        [leaderboardState.value?.data, id])

    const leaderboardUsersState = useAsync(async () => {
        return await getLeaderboardUsers(Number(id), {
            cursor: cursor?.toString(),
            limit: limitNum,
            filter: filterQuery as Record<string, string>
        })
    }, [id, cursor, limit, filterQuery])
    const leaderboardUsers = useMemo(() => leaderboardUsersState.value?.data ?? [],
        [leaderboardUsersState.value?.data])

    const totalCountState = useAsync(async () => await getLeaderboardUsersCount(Number(id), leaderboardUsersState.value?.totalCountHash), 
        [id, leaderboardUsersState.value?.totalCountHash])
    const totalCount = useMemo(() => totalCountState.value?.data, [totalCountState.value?.data])

    const [page, setPage] = useState<number | undefined>(cursor === undefined ? 1 : undefined)

    const leaderboardDistributionState = useAsync(async () => {
        return await getLeaderboardDmgDistribution(Number(id))
    }, [id])
    const leaderboardDistribution = useMemo(() => leaderboardDistributionState.value?.data, 
        [leaderboardDistributionState.value?.data])
    
    const distributionDomain = useMemo(() => {
        // if (leaderboardDistribution) {
            const values = Object.values(leaderboardDistribution?.Data ?? {})
            // adjust to closest 100
            const threshold = 100
            const min = Math.min(...values) - Math.min(...values) % threshold
            const max = Math.max(...values) + (threshold - Math.max(...values) % threshold)
            return [min, max]
        // }
        // return [0, 100]
    }, [leaderboardDistribution])

    const getTopStats = (c: Character): Property[] => {
        const result: Property[] = []
        let skippedStats = 0
        for (const propId of (c.DisplayProps ?? [])) {
            const stat = c.Stats.find((p) => p.Id === propId)
            if (stat?.Value === 0) {
                skippedStats++
                if (c.DisplayProps.length - skippedStats >= 4) continue
            }
            if (result.length >= 4) break
            if (stat) result.push(stat)
        }
        return result
    }

    // const LeaderboardEntryRow = ({ user }: { user: LeaderboardEntry }) => {
    //     const [isExpanded, { toggle }] = useDisclosure(false)
    //     return (<>
    //         <Table.Tr onClick={toggle}>
    //             <Table.Td w="64px">{user.Rank}</Table.Td>
    //             <Table.Td w="30%">
    //                 <Group gap="sm" wrap="nowrap" w="fit-content">
    //                     <Avatar src={user.Profile.ProfilePictureUrl} size="md" />
    //                     <Anchor c="gray" href={`/user/${user.Profile.Uid}?openedId=${user.Character.Id}`} onClick={(e) => {
    //                         e.stopPropagation()
    //                         e.preventDefault()
    //                         navigate(`/user/${user.Profile.Uid}?openedId=${user.Character.Id}`)
    //                     }}>{user.Profile.Nickname}</Anchor>
    //                 </Group>
    //             </Table.Td>
    //             <WeaponCell weapon={user.Character.Weapon} compareWith={leaderboard?.Weapon} />
    //             <DriveDiscsCell sets={user.Character.DriveDisksSet} />
    //             <Table.Td w="160px" bg="rgba(0 0 0 / 15%)">
    //                 <CritCell cr={user.FinalStats.BaseStats.find(p => p.Id === 20101)?.formatted?.replace("%", "") ?? ""}
    //                     cd={user.Character.Stats.find(p => p.Id === 21101)?.formatted?.replace("%", "") ?? ""} 
    //                     cv={user.Character.CritValue} />
    //             </Table.Td>
    //             {
    //                 stats(user.Character.DisplayProps, user.FinalStats.BaseStats)
    //                     .map(prop => <PropertyCell className="is-narrow" key={prop.Id} prop={prop} />)
    //             }
    //             <Table.Td w="128px" bg="rgba(0 0 0 / 25%)">
    //                 <Text fz="12pt" fw={600}>{Math.round(user.TotalValue).toLocaleString()}</Text>
    //             </Table.Td>
    //         </Table.Tr>
    //         <ExpandableRow opened={isExpanded}>
    //             <Stack gap="xs" m="md">
    //                 <Group gap="xs" align="center">
    //                     <Title order={4}>Final calculated stats</Title>
    //                     <Popover position="right" width="512px" withArrow withOverlay>
    //                         <Popover.Dropdown>
    //                             <Text>
    //                                 These are the final stats before any damage calculations take place. 
    //                                 They include all possible passives and bonuses as well as resistance shreds (such as weapon, drive disc set 4pc, and character passives) - either partially or with full uptime. 
    //                                 For more details, check out the calculator 
    //                                 <Text component="a" href="https://github.com/Night-Sky-Studio/interknot-calculator/wiki" target="_blank" c="blue"> wiki page.</Text>
    //                             </Text>
    //                         </Popover.Dropdown>
    //                         <Popover.Target>
    //                             <ActionIcon h="0.5rem" w="0.5rem" variant="light">
    //                                 <IconQuestionMark size="1rem" />
    //                             </ActionIcon>
    //                         </Popover.Target>
    //                     </Popover>
    //                 </Group>
                    
    //                 <Group gap="xs">
    //                     {user.FinalStats.CalculatedStats.filter(ss => ss.Value != 0).map(stat => {
    //                         return (
    //                             <Tooltip label={getLocalString(stat.simpleName)} key={stat.Id} portalProps={{ reuseTargetNode: true }}>
    //                                 <PropertyCell className="final-stat" useDiv prop={stat} />
    //                             </Tooltip>
    //                         )
    //                     })}
    //                 </Group>

    //                 <Space h="md" />

    //                 <Title order={4}>Drive Discs</Title>
    //                 <Group w="100%" justify="space-evenly" gap="xs">
    //                     {
    //                         Array.from({ length: 6 }, (_, i) => i + 1).map(idx => {
    //                             const disc = user.Character.DriveDisks.find(dd => dd.Slot === idx)
    //                             return <DriveDisc key={disc ? disc.Uid : user.Character.Id ^ idx} 
    //                                 slot={disc ? disc.Slot : idx} disc={disc ?? null} />
    //                         })
    //                     }
    //                 </Group>
    //             </Stack>
    //         </ExpandableRow>
    //     </>)
    // }

    const DistributionTooltip = ({ label, payload }: { label?: string, payload?: Record<string, any>[] }) => {
        if (!payload) return null;

        return (
            <Paper px="md" py="sm" withBorder shadow="md" radius="sm">
                <Text fw={500} mb={5}>
                    Top {label}%
                </Text>
                {payload.map((item: any) => (
                    <Group key={item.name}>
                        <ColorSwatch color={item.color} size={16} />
                        <Text fz="sm">
                            {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </Group>
                ))}
            </Paper>
        );
    }

    const rotation = useMemo(() => {
        return leaderboard?.Rotation.map(r => {
            const parts = r.trim().split(/\s+/)
            const [main, maybeNumber] = parts
            const result: string[] = []

            const dotSplit = main.split(".")
            const namePart = dotSplit.pop()!
            const prefix = dotSplit.length ? dotSplit.join(".") : null

            if (prefix) result.push(getLocalString(prefix))
            result.push(
                namePart
                .split("_")
                .map(word => word[0].toUpperCase() + word.slice(1))
                .join(" ")
            )
            if (maybeNumber && /^\d+$/.test(maybeNumber)) result.push(maybeNumber)

            return result
        }) ?? []
    }, [leaderboard?.Rotation])

    const [rotationOpened, { toggle: toggleRotation }] = useDisclosure(false)

    return (<>
        <title>{`${leaderboard?.FullName ?? "Loading..."} | Inter-Knot`}</title>
        <Stack>
            {leaderboardUsersState.error &&
                <Alert variant="light" color="red" title="Failed to load users" icon={<IconInfoCircle />}>
                    <Text ff="monospace">Error: {leaderboardUsersState.error.message}</Text>
                </Alert>
            }
            {leaderboard &&
                <Card withBorder style={{ position: "relative" }}>
                    <Image src={leaderboard.BackgroundUrl} 
                        alt={getLocalString(leaderboard.Character.Name)} 
                        className="background-img"
                        data-cid={leaderboard.Character.Id} />
                    <Grid gutter="xl" style={{ zIndex: 10 }}>
                        <Grid.Col span={{ base: 12, md: 7, lg: "auto" }}>
                            <Center h="100%">
                                {leaderboardDistributionState.error && 
                                    <Alert variant="light" 
                                        color={leaderboardDistributionState.error.message.includes("425") ? "orange" : "red"} 
                                        title="Failed to load distribution" icon={<IconInfoCircle />}>
                                        <Text ff="monospace">{leaderboardDistributionState.error.message}</Text>
                                    </Alert>
                                }
                                {leaderboardDistribution &&
                                    <Stack gap="0" w="100%">
                                        <LineChart h="300px" w="100%" m="sm"
                                            data={Object.entries(leaderboardDistribution.Data).map(([key, value]) => ({
                                                top: key,
                                                value: value
                                            }))} 
                                            series={[{ name: "value", color: "blue.6" }]}
                                            xAxisProps={{ tickFormatter: (value) => `top ${value}%`}}
                                            yAxisProps={{ domain: distributionDomain, tickCount: 14, tickFormatter: (value) => value.toLocaleString() }}
                                            dataKey="top" 
                                            tooltipAnimationDuration={250}
                                            tooltipProps={{ 
                                                content: ({ label, payload }) => <DistributionTooltip label={label?.toString()} payload={payload} />,
                                            }}
                                            tickLine="xy"
                                            strokeDasharray="0"
                                            gridAxis="xy"
                                            curveType="natural" />
                                        <Text fz="8pt" c="dimmed">
                                            Updated: {new Date(leaderboardDistribution.UpdatedAt).toLocaleString()}
                                        </Text>
                                    </Stack>
                                }
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 5, lg: "auto" }}>
                            <Stack c="white">
                                <Title order={2}>{leaderboard?.FullName}</Title>
                                {leaderboard?.Description &&
                                    <Text fz="12pt">{leaderboard?.Description}</Text>
                                }
                                <Group gap="xs">
                                    <Title order={5}>Weapons: </Title>
                                    {
                                        relatedLeaderboards.map(lb => {
                                            return (
                                                <WeaponButton id={lb.Id} weapon={lb.Weapon} selected={lb.Id === Number(id)} />
                                            )
                                        })
                                    }
                                </Group>
                                <Group gap="xs">
                                    <Title order={5}>Team</Title>
                                    <Team h="64px" team={[leaderboard.Character, ...leaderboard.Team]} />
                                </Group>
                                <Stack gap="xs" align="flex-start">
                                    <Group gap="0">
                                        <Button variant="transparent" c="white" onClick={toggleRotation} p="0"
                                            rightSection={rotationOpened ? <IconChevronUp /> : <IconChevronDown />}>
                                            <Title order={5}>Rotation</Title>
                                        </Button>
                                        <ActionIcon variant="transparent" c="white" onClick={() => {
                                            navigator.clipboard.writeText(
                                                rotation
                                                    .map(r => r.join(" / "))
                                                    .join("\n")
                                            )
                                            notifications.show({
                                                message: `Copied entire rotation to clipboard`,
                                                color: "blue",
                                                autoClose: 4000,
                                                icon: <IconCheck size={16} />,
                                                position: "bottom-center"
                                            })
                                        }}>
                                            <IconCopy />
                                        </ActionIcon>
                                    </Group>
                                    <Collapse in={rotationOpened}>
                                        <Group gap="4px">
                                            {
                                                rotation.map((r, idx) => 
                                                    <Chip key={`${r.join(" ")}_${idx}`} checked={false}
                                                        radius="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigator.clipboard.writeText(r.join(" / "))
                                                            notifications.show({
                                                                message: `Copied action "${r.join(" / ")}" to clipboard`,
                                                                color: "blue",
                                                                autoClose: 4000,
                                                                icon: <IconCheck size={16} />,
                                                                position: "bottom-center",
                                                            }) 
                                                        }}>
                                                        {
                                                            r.map((part, i) => 
                                                                r.length === 3 && i === 0
                                                                    ? <span key={`${part}_${i}`}><b>{part}</b> / </span>
                                                                    : <span key={`${part}_${i}`}>{part}{i === r.length - 1 ? "" : " / "}</span>
                                                            )
                                                        }
                                                    </Chip>
                                                )
                                            }
                                        </Group>
                                    </Collapse>
                                </Stack>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Card>
            }
            {leaderboardUsersState.loading &&
                <Center>
                    <Loader />
                </Center>
            }
            {leaderboardUsersState.value && <>
                <Card withBorder p="0">
                    <Stack>
                        <DataTable 
                            highlightOnHover
                            className="data-table"
                            groups={[
                                {
                                    id: "main",
                                    title: "",
                                    columns: [
                                        {
                                            accessor: "Rank",
                                            title: "#"
                                        },
                                        { 
                                            accessor: "Build.Owner",
                                            title: "Owner",
                                            render: (entry) => (
                                                <Group gap="sm" wrap="nowrap">
                                                    <ServerChip uid={entry.Build.Owner?.Uid.toString() ?? ""} />
                                                    <Avatar src={entry.Build.Owner?.ProfilePictureUrl} size="md" />
                                                    <Anchor c="gray" style={{ whiteSpace: "nowrap" }}
                                                        href={`/user/${entry.Build.Owner!.Uid}?openedId=${entry.Build.Character.Id}`} onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        navigate(`/user/${entry.Build.Owner!.Uid}?openedId=${entry.Build.Character.Id}`)
                                                    }}>{entry.Build.Owner?.Nickname}</Anchor>
                                                </Group>
                                            )
                                        },
                                        {
                                            accessor: "Build.Name",
                                            title: "Build name",
                                            render: (entry) => (
                                                <Group gap="sm" wrap="nowrap">
                                                    <Image src={entry.Build.Character.CircleIconUrl} h="32px" />
                                                    <Text c={entry.Build.Name !== undefined ? "white" : "dimmed"}
                                                        style={{ whiteSpace: "nowrap" }}>
                                                            { entry.Build.Name ?? getLocalString(entry.Build.Character.Name) }
                                                    </Text>
                                                </Group>
                                            )
                                        },
                                        { 
                                            accessor: "Build.Character.DriveDisksSet",
                                            title: "Drive Discs",
                                            render: (entry) => <DriveDiscsCell sets={entry.Build.Character.DriveDisksSet}  />
                                        },
                                        { 
                                            accessor: "Build.Character.CritValue",
                                            title: cvEnabled ? "Crit Value" : "Crit Ratio",
                                            cellsStyle: () => ({ 
                                                width: "calc(10rem * var(--mantine-scale))",
                                                background: "rgba(0 0 0 / 15%)" 
                                            }) ,
                                            render: (entry) => (
                                                <CritCell
                                                    cr={entry.Build.Character.Stats.find((p) => p.Id === 20101)?.formatted.replace("%", "") ?? ""}
                                                    cd={entry.Build.Character.Stats.find((p) => p.Id === 21101)?.formatted.replace("%", "") ?? ""}
                                                    cv={entry.Build.Character.CritValue}
                                                />
                                            )
                                        }
                                    ]
                                },
                                { 
                                    id: "stats",
                                    title: "",
                                    columns: [
                                        ...[0, 1, 2, 3].map((idx) => ({
                                            accessor: `stat-${idx}`,
                                            title: idx === 0 ? "Stats" : "",
                                            visibleMediaQuery: () => `(min-width: 1290px)`,
                                            cellsStyle: () => ({ background: "rgba(0 0 0 / 5%)" }),
                                            render: (entry: Omit<LeaderboardEntry, "Leaderboard">) => {
                                                const stats = getTopStats(entry.Build.Character)
                                                const prop = stats[idx]
                                                return prop ? <PropertyCell key={prop.Id} prop={prop} /> : null
                                            }
                                        }))
                                    ]
                                },
                                {
                                    id: "total",
                                    title: "",
                                    columns: [
                                        {
                                            accessor: "TotalValue",
                                            title: "Total Value",
                                            cellsStyle: () => ({
                                                width: "128px",
                                                background: "rgba(0 0 0 / 25%)"
                                            }),
                                            render: (entry) => (
                                                <Text fz="12pt" fw={600}>{Math.round(entry.TotalValue).toLocaleString()}</Text>
                                            )
                                        }
                                    ]
                                }
                            ]}
                            records={leaderboardUsers} />
                        <Flex mb="1rem" mx="1rem" justify="space-between" align="center" wrap="wrap">
                            <div style={{ width: "25%" }} />
                            <Group>
                                <Pagination.Root total={totalCount ? Math.ceil(totalCount / limitNum) : 1} 
                                    onFirstPage={() => {
                                        setPage(1)
                                        // setCursor(undefined)
                                        setQueryParams({ cursor: undefined })
                                    }}
                                    onLastPage={() => {
                                        setPage(totalCount ? Math.ceil(totalCount / limitNum) : 1)
                                        // setCursor("gte:crit_value=0;id=0")
                                        setQueryParams({ cursor: "gte:total_value=0;uid=0" })
                                    }}
                                    onNextPage={() => {
                                        setPage((p) => p ? p + 1 : p)
                                        if (cursor?.includes("gte:")) {
                                            // setCursor((cur) => cur?.replace("gte", "lte"))
                                            setQueryParams((prev) => ({ ...prev, cursor: prev.cursor?.toString()?.replace("gte", "lte") }))
                                        } else {
                                            // setCursor(charactersState.value?.cursor)
                                            setQueryParams({ cursor: leaderboardUsersState.value?.cursor })
                                        }
                                    }}
                                    onPreviousPage={() => {
                                        setPage((p) => p ? p - 1 : p)
                                        if (page === 1) {
                                            setQueryParams({ cursor: undefined })
                                        } else {
                                            setQueryParams({ cursor: `gte:total_value=${leaderboardUsers[0].TotalValue};uid=${leaderboardUsers[0].Build.Owner?.Uid}` })
                                        }
                                    }}>
                                    <Group gap="xs">
                                        <Pagination.First disabled={page === 1} />
                                        <Pagination.Previous disabled={page === 1} />
                                        <Button variant="filled" autoContrast>{page ?? "??"}</Button>
                                        <Pagination.Next disabled={leaderboardUsersState.value?.hasNextPage === false} />
                                        <Pagination.Last disabled={leaderboardUsersState.value?.hasNextPage === false} />
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
                {/* <Group justify="center" gap="xs">
                    <Pagination withControls autoContrast 
                        total={leaderboardUsersState.value.totalPages} 
                        value={page} onChange={setPage} />
                    <Select w="128px"
                        data={[20, 50, 75].map((i) => ({ value: `${i}`, label: `${i} / page` }))}
                        value={limit.toString()}
                        onChange={(value) => {
                            value && setLimit(Number(value))
                        }} />
                </Group> */}
            </>}
        </Stack>
    </>)
}