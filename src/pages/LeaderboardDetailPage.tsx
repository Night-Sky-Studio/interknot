import { useNavigate, useParams, useSearchParams } from "react-router"
import { useAsync } from "react-use"
import { getLeaderboard, getLeaderboardDmgDistribution, getLeaderboardUsers } from "../api/data"
import { Alert, Card, Center, Group, Loader, Pagination, Select, Stack, Table, Text, Title, Image, Tooltip, ActionIcon, Popover, Grid, Paper, ColorSwatch, Space, Avatar, Chip, Collapse, Button, Anchor } from "@mantine/core"
import { IconCheck, IconChevronDown, IconChevronUp, IconCopy, IconInfoCircle, IconQuestionMark } from "@tabler/icons-react"
import CritCell from "../components/cells/CritCell"
import { LineChart } from "@mantine/charts"
import WeaponButton from "../components/WeaponButton"
import { useMemo } from "react"
import { LeaderboardEntry, Property } from "@interknot/types"
import PropertyCell from "../components/cells/PropertyCell"
import WeaponCell from "../components/cells/WeaponCell"
import DriveDiscsCell from "../components/cells/DriveDiscsCell"
import { useDisclosure } from "@mantine/hooks"
import { ExpandableRow } from "../components/ExpandableRow"
import "./styles/LeaderboardDetailsPage.pcss"
import { useSettings } from "../components/SettingsProvider"
import { Team } from "../components/Team"
import { DriveDisc } from "../components/DriveDisc"
import { notifications } from '@mantine/notifications'

export default function LeaderboardDetailPage(): React.ReactElement {
    const navigate = useNavigate()
    const { id } = useParams()

    const [searchParams, _] = useSearchParams()

    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "20")

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

    const { getLocalString } = useSettings()

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

    const leaderboardDistribution = useMemo(() => { return leaderboardDistributionState.value }, [leaderboardDistributionState.value])
    const distributionDomain = useMemo(() => {
        if (leaderboardDistribution) {
            const values = Object.values(leaderboardDistribution.Data)
            // adjust to closest 100
            const threshold = 100
            const min = Math.min(...values) - Math.min(...values) % threshold
            const max = Math.max(...values) + (threshold - Math.max(...values) % threshold)
            return [min, max]
        }
        return [0, 100]
    }
    , [leaderboardDistribution])

    const stats = (displayProps: number[], baseStats: Property[]) => {
        const result: Property[] = []
        let skippedStats = 0
        for (const prodId of displayProps) {
            const stat = baseStats.find(p => p.Id === prodId)
            if (stat?.Value === 0) {
                skippedStats++
                if (displayProps.length - skippedStats >= 4)
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

    const LeaderboardEntryRow = ({ user }: { user: LeaderboardEntry }) => {
        const [isExpanded, { toggle }] = useDisclosure(false)
        return (<>
            <Table.Tr onClick={toggle}>
                <Table.Td w="64px">{user.Rank}</Table.Td>
                <Table.Td w="30%">
                    <Group gap="sm" wrap="nowrap" w="fit-content">
                        <Avatar src={user.Profile.ProfilePictureUrl} size="md" />
                        <Anchor c="gray" href={`/user/${user.Profile.Uid}?openedId=${user.Character.Id}`} onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            navigate(`/user/${user.Profile.Uid}?openedId=${user.Character.Id}`)
                        }}>{user.Profile.Nickname}</Anchor>
                    </Group>
                </Table.Td>
                <WeaponCell weapon={user.Character.Weapon} compareWith={currentLeaderboard?.Weapon} />
                <DriveDiscsCell sets={user.Character.DriveDisksSet} />
                <Table.Td w="160px" bg="rgba(0 0 0 / 15%)">
                    <CritCell cr={user.FinalStats.BaseStats.find(p => p.Id === 20101)?.formatted?.replace("%", "") ?? ""}
                        cd={user.Character.Stats.find(p => p.Id === 21101)?.formatted?.replace("%", "") ?? ""} 
                        cv={user.Character.CritValue} />
                </Table.Td>
                {
                    stats(user.Character.DisplayProps, user.FinalStats.BaseStats)
                        .map(prop => <PropertyCell className="is-narrow" key={prop.Id} prop={prop} />)
                }
                <Table.Td w="128px" bg="rgba(0 0 0 / 25%)">
                    <Text fz="12pt" fw={600}>{Math.round(user.TotalValue).toLocaleString()}</Text>
                </Table.Td>
            </Table.Tr>
            <ExpandableRow opened={isExpanded}>
                <Stack gap="xs" m="md">
                    <Group gap="xs" align="center">
                        <Title order={4}>Final calculated stats</Title>
                        <Popover position="right" width="512px" withArrow withOverlay>
                            <Popover.Dropdown>
                                <Text>
                                    These are the final stats before any damage calculations take place. 
                                    They include all possible passives and bonuses as well as resistance shreds (such as weapon, drive disc set 4pc, and character passives) - either partially or with full uptime. 
                                    For more details, check out the calculator 
                                    <Text component="a" href="https://github.com/Night-Sky-Studio/interknot-calculator/wiki" target="_blank" c="blue"> wiki page.</Text>
                                </Text>
                            </Popover.Dropdown>
                            <Popover.Target>
                                <ActionIcon h="0.5rem" w="0.5rem" variant="light">
                                    <IconQuestionMark size="1rem" />
                                </ActionIcon>
                            </Popover.Target>
                        </Popover>
                    </Group>
                    
                    <Group gap="xs">
                        {user.FinalStats.CalculatedStats.filter(ss => ss.Value != 0).map(stat => {
                            return (
                                <Tooltip label={getLocalString(stat.simpleName)} key={stat.Id} portalProps={{ reuseTargetNode: true }}>
                                    <PropertyCell className="final-stat" useDiv prop={stat} />
                                </Tooltip>
                            )
                        })}
                    </Group>

                    <Space h="md" />

                    <Title order={4}>Drive Discs</Title>
                    <Group w="100%" justify="space-evenly" gap="xs">
                        {
                            Array.from({ length: 6 }, (_, i) => i + 1).map(idx => {
                                const disc = user.Character.DriveDisks.find(dd => dd.Slot === idx)
                                return <DriveDisc key={disc ? disc.Uid : user.Character.Id ^ idx} 
                                    slot={disc ? disc.Slot : idx} disc={disc ?? null} />
                            })
                        }
                    </Group>
                </Stack>
            </ExpandableRow>
        </>)
    }

    const DistributionTooltip = ({ label, payload }: { label: string, payload: Record<string, any>[] | undefined }) => {
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

    const parseRotation = (rotation: string) => {
        const parts = rotation.trim().split(/\s+/)
        const [main, maybeNumber] = parts
        const result: string[] = []

        const dotSplit = main.split(".")
        const namePart = dotSplit.pop()!
        const prefix = dotSplit.length ? dotSplit.join(".") : null

        if (prefix) result.push(getLocalString(prefix));
        result.push(
            namePart
            .split("_")
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(" ")
        )
        if (maybeNumber && /^\d+$/.test(maybeNumber)) result.push(maybeNumber)

        return result
    }

    const [rotationOpened, { toggle: toggleRotation }] = useDisclosure(false)

    return (<>
        <title>{`${currentLeaderboard?.FullName} | Inter-Knot`}</title>
        <Stack>
            {leaderboardUsersState.error &&
                <Alert variant="light" color="red" title="Failed to load users" icon={<IconInfoCircle />}>
                    <Text ff="monospace">Error: {leaderboardUsersState.error.message}</Text>
                </Alert>
            }
            {leaderboardState.value && currentLeaderboard &&
                <Card withBorder style={{ position: "relative" }}>
                    <Image src={currentLeaderboard.BackgroundUrl} 
                        alt={getLocalString(currentLeaderboard.Character.Name)} 
                        className="background-img"
                        data-cid={currentLeaderboard.Character.Id} />
                    <Grid gutter="xl" style={{ zIndex: 10 }}>
                        <Grid.Col span={{ base: 12, md: 7, lg: "auto" }}>
                            <Center h="100%">
                                {leaderboardDistributionState.error && 
                                    <Alert variant="light" 
                                        color={leaderboardDistributionState.error.message.includes("425") ? "orange" : "red"} 
                                        title="Failed to load distribution" icon={<IconInfoCircle />}>
                                        <Text ff="monospace">Error {leaderboardDistributionState.error.message}</Text>
                                    </Alert>
                                }
                                {leaderboardDistributionState.value && leaderboardDistribution &&
                                    <Stack gap="0">
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
                                                content: ({ label, payload }) => <DistributionTooltip label={label} payload={payload} />,
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
                                <Title order={2}>{currentLeaderboard?.FullName}</Title>
                                {currentLeaderboard?.Description &&
                                    <Text fz="12pt">{currentLeaderboard?.Description}</Text>
                                }
                                <Group gap="xs">
                                    <Title order={5}>Weapons: </Title>
                                    {
                                        leaderboardState.value.map(lb => {
                                            return (
                                                <WeaponButton id={lb.Id} weapon={lb.Weapon} selected={lb.Id === Number(id)} />
                                            )
                                        })
                                    }
                                </Group>
                                <Group gap="xs">
                                    <Title order={5}>Team</Title>
                                    <Team h="64px" team={[currentLeaderboard.Character, ...currentLeaderboard.Team]} />
                                </Group>
                                <Stack gap="xs" align="flex-start">
                                    <Group gap="0">
                                        <Button variant="transparent" c="white" onClick={toggleRotation} p="0"
                                            rightSection={rotationOpened ? <IconChevronUp /> : <IconChevronDown />}>
                                            <Title order={5}>Rotation</Title>
                                        </Button>
                                        <ActionIcon variant="transparent" c="white" onClick={() => {
                                            navigator.clipboard.writeText(currentLeaderboard.Rotation
                                                .map(parseRotation)
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
                                                currentLeaderboard?.Rotation
                                                    .map(parseRotation)
                                                    .map((r, idx) => 
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
                                <Table.Th>Weapon</Table.Th>
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
                                    <LeaderboardEntryRow key={user.Profile.Uid} user={user} />
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
                        data={[20, 50, 75].map((i) => ({ value: `${i}`, label: `${i} / page` }))}
                        value={limit.toString()}
                        onChange={(value) => {
                            value && setLimit(Number(value))
                        }} />
                </Group>
            </>}
        </Stack>
    </>)
}