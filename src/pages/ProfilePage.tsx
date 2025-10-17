import { useParams } from "react-router"
import { UserHeaderMemorized } from "@components/UserHeader/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center, Collapse, Alert, Text, Tooltip, Image, LoadingOverlay, Card, Flex, Pagination, Select } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAsync, useAsyncRetry } from "react-use"
import { getCharacters, getCharactersCount, getDriveDiscs, getDriveDiscsCount, getProfile, getUserLeaderboards, IQueryParams } from "../api/data"
import { IconChevronDown, IconChevronUp, IconInfoCircle, IconReload, IconStar, IconStarFilled } from "@tabler/icons-react"
import Timer from "@components/Timer"
import "./styles/ProfilePage.css"
import { LeaderboardGridMemorized } from "@components/LeaderboardGrid/LeaderboardGrid"
import { BaseLeaderboardEntry, Character, DriveDisc, ProfileInfo, Property } from "@interknot/types"
import LeaderboardProvider from "@components/LeaderboardProvider"
import { useBackend } from "@components/BackendProvider"
import { getRarityIcon } from "@components/icons/Icons"
import { useSettings } from "@components/SettingsProvider"
import { useQueryParams } from "@/hooks/useQueryParams"
import { DataTable } from "mantine-datatable"
import WeaponCell from "@/components/cells/WeaponCell"
import DriveDiscsCell from "@/components/cells/DriveDiscsCell"
import CritCell, { discCvColor, discCvWeight } from "@/components/cells/CritCell"
import PropertyCell from "@/components/cells/PropertyCell"
import FilterSelector from "@/components/FilterSelector/FilterSelector"
import CharacterCardContainer from "@/components/CharacterCard/CharacterCardContainer"
import { DataProvider } from "@/components/DataProvider"
import { TooltipData } from "@/components/CharacterCard/CharacterCard"
import CardFooter from "@/components/CardFooter/CardFooter"
import CardSettingsProvider from "@/components/CardSettingsProvider"
import DriveDiscCard from "@/components/DriveDiscCard/DriveDiscCard"

function timeAgoIntl(date: Date | string) {
    if (typeof date === "string") {
        date = new Date(date)
    }

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

    const seconds = Math.floor((date.getTime() - Date.now()) / 1000)

    if (Math.abs(seconds) <= 60) {
        return "just now"
    }

    const ranges = {
        year: 3600 * 24 * 365,
        month: 3600 * 24 * 30,
        week: 3600 * 24 * 7,
        day: 3600 * 24,
        hour: 3600,
        minute: 60,
        second: 1,
    }

    for (const [unit, value] of Object.entries(ranges)) {
        if (Math.abs(seconds) >= value || unit === "second") {
            return rtf.format(Math.round(seconds / value), unit as Intl.RelativeTimeFormatUnit)
        }
    }
}

export default function ProfilePage(): React.ReactElement {
    const { uid } = useParams()
    // const initialOpenedId = useSearchParam("openedId")
    const backend = useBackend()
    const { cvEnabled, getLocalString, getLevel } = useSettings()

    const [{ openedId: initialOpenedId, cursor, limit, ...filterQuery }, setQueryParams] = useQueryParams()
    const limitNum = useMemo(() => Number(limit) || 20, [limit])
    const [discsQuery, setDiscsQuery] = useState<IQueryParams>({ uid: uid ? Number(uid) : undefined })

    const [updateRequested, setUpdateRequested] = useState(false)
    const [canUpdate, setCanUpdate] = useState(true)

    const [savedUsers, setSavedUsers] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [favoriteUsers, setFavoriteUsers] = useLocalStorage<number[]>({ key: "favoriteUsers", defaultValue: [] })

    const [ttl, setTtl] = useState(0)
    const [profile, setProfile] = useState<ProfileInfo | undefined>(undefined)
    const [characters, setCharacters] = useState<Character[] | undefined>(undefined)
    const [discs, setDiscs] = useState<DriveDisc[]>([])
    const [leaderboards, setLeaderboards] = useState<Omit<BaseLeaderboardEntry, "RotationValue">[] | undefined>(undefined)

    const profileState = useAsyncRetry(async () => {
        const result = await getProfile(Number(uid), updateRequested)
        if (result.ttl) {
            setTtl(result.ttl)
        }
        if (result.data) {
            setProfile(result.data)
        }
        return result
    }, [uid, updateRequested])
    const charactersState = useAsyncRetry(async () => {
        if (!profileState.value?.data) return undefined 
        const result = await getCharacters({
            uid: Number(uid),
            cursor: cursor?.toString(),
            limit: limitNum,
            filter: filterQuery as Record<string, string>
        })
        if (result && result.data) {
            setCharacters(result.data.map(c => c.Character))
        }
        return result
    }, [uid, profileState.value?.data, cursor, limitNum, filterQuery])
    const discsState = useAsyncRetry(async () => {
        if (!profileState.value?.data) return undefined 
        const result = await getDriveDiscs(discsQuery)
        if (result && result.data) {
            setDiscs(result.data)
        }
        return result
    }, [profileState.value?.data, discsQuery])
    const leaderboardsState = useAsyncRetry(async () => {
        if (!profileState.value?.data) return undefined 
        const result = await getUserLeaderboards(Number(uid), updateRequested)
        if (result && result.data) {
            setLeaderboards(result.data)
        }
        return result
    }, [uid, profileState.value?.data, updateRequested])

    const [page, setPage] = useState<number | undefined>(cursor === undefined ? 1 : undefined)
    const totalCountState = useAsync(async () => {
        return await getCharactersCount({
            uid: uid ? Number(uid) : undefined,
            hash: charactersState.value?.totalCountHash
        })
    }, [charactersState.value?.totalCountHash])
    const totalCount = useMemo(() => totalCountState.value?.data, [totalCountState.value?.data])

    const [discsPage, setDiscsPage] = useState(1)
    const [discsLimit, setDiscsLimit] = useState(20)
    const discsTotalCountState = useAsync(async () => {
        return await getDriveDiscsCount({
            uid: uid ? Number(uid) : undefined,
            hash: discsState.value?.totalCountHash
        })
    }, [discsState.value?.totalCountHash])
    const discsTotalCount = useMemo(() => discsTotalCountState.value?.data, [discsTotalCountState.value?.data])

    const [opened, { toggle }] = useDisclosure(true)

    const toggleIsFavorite = () => {
        const userId = Number(uid)
        if (favoriteUsers.includes(userId)) {
            setFavoriteUsers(favoriteUsers.filter(u => u !== userId))
        } else {
            setFavoriteUsers([...favoriteUsers, userId])
        }
    }

    // Update opened profiles
    useEffect(() => {
        if (profile) {
            setSavedUsers((prev) => {
                const data = [...prev]
                const previousProfileIdx = data.findIndex(u => u.Uid === profile.Uid)
                if (previousProfileIdx != -1) {
                    data[previousProfileIdx] = profile
                } else {
                    data.push(profile)
                }
                return data
            })
        }
        setCanUpdate((ttl ?? 0) == 0)
    }, [profile, ttl])

    /*
    // Initialize backups when profile loads successfully
    useEffect(() => {
        if (profileBackup && !profileState.error) {
            setProfileBackup(profileBackup)
        }
    }, [profileBackup, profileState.error])

    useEffect(() => {
        if (leaderboardsState.value && !leaderboardsState.error) {
            setLeaderboardsBackup(leaderboardsState.value)
        }
        if (leaderboardsState.error) {
            toggle() // Collapse leaderboards on error
        }
    }, [leaderboardsState.value, leaderboardsState.error])

    useEffect(() => {
        if (profileBackup)
            console.log(`User ${profileBackup.Information.Uid}, TTL: ${profileBackup.Ttl}, needsUpdate: ${updateRequested}, canUpdate: ${canUpdate}, favoriteUsers: ${favoriteUsers.join(',')}`)
    }, [profileBackup, updateRequested, favoriteUsers])

    */

    const [openedId, setOpenedId] = useState<number | null>(initialOpenedId ? Number(initialOpenedId) : null)

    /*
    const errorHandler = (error: string) => {
        // try parse
        try {
            const parsedError = JSON.parse(error) as unknown as BackendError
            return `Error ${parsedError.Code}: ${parsedError.Message}\n${parsedError.Details}`
        } catch {
            return `Error: ${error}`
        }
    }
    */

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

    const tableRef = useRef<HTMLDivElement>(null)

    return (<>
        {profileState.loading && !profile && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title>
            <Center><Loader /></Center>
        </>}
        {profileState.error && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title>
            <Alert variant="light" color="red" title="Failed to load profile" icon={<IconInfoCircle />} mb="md">
                <Text ff="monospace">{profileState.error.message}</Text>
            </Alert>
        </>}
        {profile && <>
            <title>{`${profile?.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${profile?.Nickname}'s Profile | Inter-Knot`} />
            
                <Stack>
                    <Group justify="flex-end" gap="xs">
                        <Text c="dimmed">Last updated {timeAgoIntl(profile.UpdatedAt)}</Text>
                        {backend.state && !backend.state.params.update_enabled &&
                            <Tooltip label={backend.state?.params.update_disabled_msg} withArrow portalProps={{ reuseTargetNode: true }}>
                                <Button rightSection={<IconReload />} disabled>Update</Button>
                            </Tooltip>
                        }
                        {backend.state && backend.state.params.update_enabled &&
                            <Button rightSection={<IconReload />} disabled={!canUpdate} onClick={() => {
                                setCanUpdate(false)
                                setUpdateRequested(true)
                                profileState.retry()
                                leaderboardsState.retry()
                            }}>
                                <Timer key={uid} title="Update" isEnabled={!canUpdate}
                                    endTime={ttl === 0 ? 60 : ttl}
                                    onTimerEnd={() => {
                                        setCanUpdate(true)
                                        setUpdateRequested(false)
                                    }} />
                            </Button>
                        }
                        <ActionIcon onClick={toggleIsFavorite}>
                            {favoriteUsers.includes(Number(uid)) ? <IconStarFilled /> : <IconStar />}
                        </ActionIcon>
                        <ActionIcon style={{ fontFamily: "shicon", fontSize: "1.5rem" }}
                            component="a" href={`https://enka.network/zzz/${uid}`} target="_blank">
                            {""}
                        </ActionIcon>
                    </Group>
                    <Stack gap="0px" align="center">
                        <UserHeaderMemorized user={profile} showDescription={profile.Description !== ""} />
                        <Collapse in={opened} className="leaderboards" data-open={opened}>
                            {
                                leaderboardsState.loading && <Center m="md"><Loader /></Center>
                            }
                            {
                                leaderboards &&
                                <LeaderboardGridMemorized
                                    entries={leaderboards}
                                    onProfileClick={(agentId) => {
                                        setOpenedId(agentId === openedId ? null : agentId)
                                    }} />
                            }
                            {
                                leaderboardsState.error && <Center m="md">Failed to load leaderboards. Cause: {leaderboardsState.error.message}</Center>
                            }
                        </Collapse>
                        <Button variant="transparent" className="lb-expand-button" leftSection={opened ? <IconChevronUp /> : <IconChevronDown />} onClick={toggle}>
                            Leaderboards
                        </Button>
                    </Stack>
                    {characters?.length === 0 &&
                        <Center>
                            <Alert variant="light" color="blue" title="No characters data found!" icon={<IconInfoCircle />}
                                maw="50%">
                                <Text>
                                    If you're adding your profile to Inter-Knot for the first time, please check that your
                                    <Text component="a" c="blue"
                                        href="https://zenless-zone-zero.fandom.com/wiki/Profile#:~:text=Agent%20Showcase%3A%20Showcase%20up%20to%206%20unlocked%20Agents%20and%20their%20current%20Level."
                                        target="_blank"> Agents Showcase</Text> is not empty and refresh your profile on Inter-Knot with <Text span c="blue">Update</Text> button.
                                </Text>
                            </Alert>
                        </Center>
                    }
                    {characters?.length !== 0 &&
                        <Stack>
                            <FilterSelector
                                exclude={["region", "set_id"]}
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
                                    // console.log(q)
                                    setQueryParams((prev) => ({ cursor: undefined, limit: prev.limit, ...q }), true)
                                    setPage(1)
                                }} />
                            <Card p="0" pos="relative" withBorder>
                                <Stack>
                                    <LoadingOverlay visible={charactersState.loading} zIndex={9}
                                        overlayProps={{ radius: "sm", blur: 2 }} />
                                    <DataTable
                                        scrollViewportRef={tableRef}
                                        highlightOnHover
                                        className="data-table"
                                        groups={[
                                            {
                                                id: "main",
                                                title: "",
                                                columns: [
                                                    {
                                                        accessor: "Id",
                                                        title: "#",
                                                        cellsStyle: () => ({ maxWidth: "3ch" }),
                                                        render: (_, r) => <Text>{((page ?? 0) - 1) * limitNum + r + 1}</Text>,
                                                    },
                                                    {
                                                        accessor: "Name",
                                                        title: "Name",
                                                        cellsStyle: () => ({ maxWidth: "30%" }),
                                                        render: (c) => (
                                                            <Group gap="sm" wrap="nowrap">
                                                                <Image src={c.CircleIconUrl} h="32px" />
                                                                <Text style={{ whiteSpace: "nowrap" }}>{getLocalString(c.Name)}</Text>
                                                                <div className="chip">{getLevel(c.Level)}</div>
                                                            </Group>
                                                        )
                                                    },
                                                    {
                                                        accessor: "MindscapeLevel",
                                                        title: "Mindscape",
                                                        render: (c) => (
                                                            <div className="chip mindscape-chip" style={{ padding: `0.125rem ${(c.MindscapeLevel / 5 + 1) * 1}rem` }} data-level={c.MindscapeLevel}>
                                                                <Text fw={700}>{c.MindscapeLevel}</Text>
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        accessor: "Weapon",
                                                        title: "Weapon",
                                                        render: (c) => <WeaponCell weapon={c.Weapon} />
                                                    },
                                                    {
                                                        accessor: "DriveDisksSet",
                                                        title: "Drive Discs",
                                                        render: (c) => <DriveDiscsCell sets={c.DriveDisksSet} />
                                                    },
                                                    {
                                                        accessor: "CritValue",
                                                        title: cvEnabled ? "Crit Value" : "Crit Rate / Crit DMG",
                                                        cellsStyle: () => ({
                                                            width: "calc(10rem * var(--mantine-scale))",
                                                            background: "rgba(0 0 0 / 15%)"
                                                        }),
                                                        render: (c) => (
                                                            <CritCell
                                                                cr={c.Stats.find((p) => p.Id === 20101)?.formatted.replace("%", "") ?? ""}
                                                                cd={c.Stats.find((p) => p.Id === 21101)?.formatted.replace("%", "") ?? ""}
                                                                cv={c.CritValue}
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
                                                        render: (c: Character) => {
                                                            const stats = getTopStats(c)
                                                            const prop = stats[idx]
                                                            return prop ? <PropertyCell key={prop.Id} prop={prop} /> : null
                                                        }
                                                    }))
                                                ]
                                            }
                                        ]}
                                        rowExpansion={{
                                            allowMultiple: true,
                                            content: ({ record: character }) => (
                                                <LeaderboardProvider uid={Number(uid)} characterId={character.Id}>
                                                    <DataProvider data={{ 
                                                        charId: character.Id, 
                                                        weaponId: character.Weapon?.Id,
                                                        charName: character.Name,
                                                        uid: Number(uid)
                                                    } satisfies TooltipData}>
                                                        <CardSettingsProvider>
                                                            <CharacterCardContainer parentRef={tableRef} cardProps={{
                                                                uid: Number(uid),
                                                                username: profile.Nickname,
                                                                character: character,
                                                            }} />
                                                            <Stack m="md">
                                                                <CardFooter />
                                                            </Stack>
                                                        </CardSettingsProvider>
                                                    </DataProvider>
                                                </LeaderboardProvider>
                                            )
                                        }}
                                        records={characters}
                                        idAccessor="Id"
                                    />
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
                                                    setQueryParams({ cursor: "gte:crit_value=0;id=0" })
                                                }}
                                                onNextPage={() => {
                                                    setPage((p) => p ? p + 1 : p)
                                                    if (cursor?.includes("gte:")) {
                                                        // setCursor((cur) => cur?.replace("gte", "lte"))
                                                        setQueryParams((prev) => ({ ...prev, cursor: prev.cursor?.toString()?.replace("gte", "lte") }))
                                                    } else {
                                                        // setCursor(charactersState.value?.cursor)
                                                        setQueryParams({ cursor: charactersState.value?.cursor })
                                                    }
                                                }}
                                                onPreviousPage={() => {
                                                    setPage((p) => p ? p - 1 : p)
                                                    if (page === 1) {
                                                        setQueryParams({ cursor: undefined })
                                                    } else {
                                                        setQueryParams({ cursor: `gte:crit_value=${characters?.[0].CritValue};id=${characters?.[0].Id}` })
                                                    }
                                                }}>
                                                <Group gap="xs">
                                                    <Pagination.First disabled={page === 1} />
                                                    <Pagination.Previous disabled={page === 1} />
                                                    <Button variant="filled" autoContrast>{page ?? "??"}</Button>
                                                    <Pagination.Next disabled={charactersState.value?.hasNextPage === false} />
                                                    <Pagination.Last disabled={charactersState.value?.hasNextPage === false} />
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
                                        {!page &&
                                            <Text mr="1rem">Showing unknown page of {totalCount ?? "unknown count"}</Text>
                                        }
                                        {page &&
                                            <Text mr="1rem">Showing {limitNum * (page - 1) + 1} - {totalCount ? Math.min(totalCount, limitNum * page) : "?"} of {totalCount ?? "unknown count"}</Text>
                                        }
                                    </Flex>
                                </Stack>
                            </Card>
                        </Stack>
                        // <Stack>
                        //     <CharactersTableMemorized uid={profile.Uid} username={profile.Nickname} 
                        //         characters={characters} lbAgents={leaderboards} openedId={openedId} />
                        // </Stack>
                    }

                    {discs?.length !== 0 &&
                        <Stack mt="4rem">
                            <FilterSelector
                                exclude={["region", "character_id", "weapon_id", "partial_sets", "full_set", "mindscape_level", "weapon_refinement_level"]}
                                value={Object.entries(discsQuery.filter ?? {}).flatMap(([k, v]) => {
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
                                            case "prop_id":
                                                break
                                            default:
                                                add(g, val)
                                                break
                                        }
                                    })
                                    // console.log(q)
                                    setDiscsQuery((prev) => ({ ...prev, cursor: undefined, limit: prev.limit, filter: q }))
                                    setDiscsPage(1)
                                }} />
                            <Card p="0" withBorder>
                                <Stack>
                                    <LoadingOverlay visible={discsState.loading} zIndex={9}
                                        overlayProps={{ radius: "sm", blur: 2 }} />
                                    <DataTable
                                        highlightOnHover
                                        className="data-table"
                                        groups={[
                                            {
                                                id: "main",
                                                title: "",
                                                columns: [
                                                    {
                                                        accessor: "Uid",
                                                        title: "#",
                                                        cellsStyle: () => ({ maxWidth: "3ch" }),
                                                        render: (_, r) => <Text>{(discsPage - 1) * discsLimit + r + 1}</Text>,
                                                    },
                                                    {
                                                        accessor: "Name",
                                                        title: "Name",
                                                        cellsStyle: () => ({ maxWidth: "30%" }),
                                                        render: (d) => (
                                                            <Group gap="xs" wrap="nowrap">
                                                                <Image src={d.IconUrl} h="32px" />
                                                                <Image src={getRarityIcon(d.Rarity ?? 0)} h="24px" alt={d.Rarity.toString()} />
                                                                <Text style={{ whiteSpace: "nowrap" }}>{getLocalString(d.Name)}</Text>
                                                            </Group>
                                                        )
                                                    },
                                                    {
                                                        accessor: "MainStat",
                                                        title: "Main Stat",
                                                        render: (d) => (
                                                            <Group gap="xs" wrap="nowrap">
                                                                <PropertyCell prop={d.MainStat} />
                                                                <Text style={{ whiteSpace: "nowrap" }}>{getLocalString(d.MainStat.simpleName)}</Text>
                                                            </Group>
                                                        )
                                                    }
                                                ]
                                            },
                                            {
                                                id: "stats",
                                                title: "",
                                                columns: [
                                                    ...[0, 1, 2, 3].map((idx) => ({
                                                        accessor: `disc-stat-${idx}`,
                                                        title: idx === 0 ? "Stats" : "",
                                                        visibleMediaQuery: () => `(min-width: 1290px)`,
                                                        cellsStyle: () => ({ background: "rgba(0 0 0 / 5%)" }),
                                                        render: (d: DriveDisc) => {
                                                            const stats = d.SubStats
                                                            const prop = stats[idx]
                                                            return prop ? <PropertyCell key={prop.Id} prop={prop} /> : null
                                                        }
                                                    }))
                                                ]
                                            },
                                            {
                                                id: "critValue",
                                                title: "",
                                                columns: [
                                                    {
                                                        accessor: "CritValue.Value",
                                                        title: "Crit Value",
                                                        cellsStyle: () => ({
                                                            width: "calc(10rem * var(--mantine-scale))",
                                                            background: "rgba(0 0 0 / 15%)"
                                                        }),
                                                        render: (d: DriveDisc) => (
                                                            <div className="crit-cell">
                                                                <Text c={discCvColor(d.CritValue.Value)} fw={discCvWeight(d.CritValue.Value)} >{d.CritValue.Value / 100}</Text>
                                                            </div>
                                                        )
                                                    }
                                                ]
                                            }
                                        ]}
                                        rowExpansion={{
                                            allowMultiple: true,
                                            content: ({ record: disc }) => <Center m="lg">
                                                <DriveDiscCard disc={disc} />
                                            </Center>
                                        }}
                                        records={discs}
                                        idAccessor="Uid"
                                    />
                                    <Flex mb="1rem" mx="1rem" justify="space-between" align="center" wrap="wrap">
                                        <div style={{ width: "25%" }} />
                                        <Group>
                                            <Pagination.Root total={discsTotalCount ? Math.ceil(discsTotalCount / discsLimit) : 1}
                                                onFirstPage={() => {
                                                    setDiscsPage(1)
                                                    setDiscsQuery((prev) => ({ ...prev, cursor: undefined }))
                                                }}
                                                onLastPage={() => {
                                                    setDiscsPage(discsTotalCount ? Math.ceil(discsTotalCount / discsLimit) : 1)
                                                    setDiscsQuery((prev) => ({ ...prev, cursor: "gte:crit_value=0;id=0" }))
                                                }}
                                                onNextPage={() => {
                                                    setDiscsPage((p) => p ? p + 1 : p)
                                                    if (discsQuery.cursor?.includes("gte:")) {
                                                        setDiscsQuery((prev) => ({ ...prev, cursor: prev.cursor?.toString()?.replace("gte", "lte") }))
                                                    } else {
                                                        setDiscsQuery((prev) => ({ ...prev, cursor: discsState.value?.cursor }))
                                                    }
                                                }}
                                                onPreviousPage={() => {
                                                    setDiscsPage((p) => p ? p - 1 : p)
                                                    if (page === 1) {
                                                        setDiscsQuery((prev) => ({ ...prev, cursor: undefined }))
                                                    } else {
                                                        setDiscsQuery((prev) => ({ ...prev, cursor: `gte:crit_value=${discs?.[0].CritValue.Value};id=${discs?.[0].Id}` }))
                                                    }
                                                }}>
                                                <Group gap="xs">
                                                    <Pagination.First disabled={discsPage === 1} />
                                                    <Pagination.Previous disabled={discsPage === 1} />
                                                    <Button variant="filled" autoContrast>{discsPage ?? "??"}</Button>
                                                    <Pagination.Next disabled={discsState.value?.hasNextPage === false} />
                                                    <Pagination.Last disabled={discsState.value?.hasNextPage === false} />
                                                </Group>
                                            </Pagination.Root>
                                            <Select w="128px"
                                                data={[20, 50].map((i) => ({ value: `${i}`, label: `${i} / page` }))}
                                                value={discsLimit.toString()}
                                                onChange={(value) => {
                                                    if (value) {
                                                        setDiscsPage(1)
                                                        setDiscsLimit(Number(value))
                                                        setDiscsQuery((prev) => ({ ...prev, cursor: undefined, limit: Number(value) }))
                                                    }
                                                }} />
                                        </Group>
                                        {!page &&
                                            <Text mr="1rem">Showing unknown page of {discsTotalCount ?? "unknown count"}</Text>
                                        }
                                        {page &&
                                            <Text mr="1rem">Showing {discsLimit * (discsPage - 1) + 1} - {discsTotalCount ? Math.min(discsTotalCount, discsLimit * discsPage) : "?"} of {discsTotalCount ?? "unknown count"}</Text>
                                        }
                                    </Flex>
                                </Stack>
                            </Card>
                        </Stack>
                    }
                </Stack>
        </>
        }
    </>)
}