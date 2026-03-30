import { useParams } from "react-router"
import { UserHeaderMemoized } from "@components/UserHeader/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center, Collapse, Alert, Text, Tooltip, Image, LoadingOverlay, Card, Flex, Pagination, Select, Popover, Code } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAsync, useAsyncRetry } from "react-use"
import {
    getCharacters, getCharactersCount, getDriveDiscs, getDriveDiscsCount, getProfile, getProfileClaim,
    getTopStats, getUserLeaderboards, initProfileClaim, IQueryParams
} from "@api/data"
import { IconCheck, IconChevronDown, IconChevronUp, IconCopy, IconEyeOff, IconInfoCircle, IconKeyFilled, IconLockFilled, IconReload, IconSettingsFilled, IconStar, IconStarFilled } from "@tabler/icons-react"
import Timer from "@components/Timer"
import "./styles/ProfilePage.css"
import { LeaderboardGridMemorized } from "@components/LeaderboardGrid/LeaderboardGrid"
import { BaseLeaderboardEntry, Build, DriveDisc, ProfileInfo } from "@interknot/types"
import LeaderboardProvider from "@components/LeaderboardProvider"
import { useBackend } from "@components/BackendProvider"
import { getRarityIcon } from "@components/icons/Icons"
import { useSettings } from "@components/SettingsProvider"
import { useQueryParams } from "@/hooks/useQueryParams"
import { DataTable } from "mantine-datatable"
import WeaponCell from "@components/cells/WeaponCell"
import DriveDiscsCell from "@components/cells/DriveDiscsCell"
import CritCell, { discCvColor, discCvWeight } from "@components/cells/CritCell"
import PropertyCell from "@components/cells/PropertyCell"
import FilterSelector from "@components/FilterSelector/FilterSelector"
import CharacterCardContainer from "@components/CharacterCard/CharacterCardContainer"
import { DataProvider } from "@components/DataProvider"
import { ICardContext } from "@components/CharacterCard/CharacterCard"
import CardFooter from "@components/CardFooter/CardFooter"
import CardSettingsProvider from "@components/CardSettingsProvider"
import DriveDiscCard from "@components/DriveDiscCard/DriveDiscCard"
import { useAuth } from "@components/AuthProvider"
import { notifications } from '@mantine/notifications'
import BuildsSettingsModal from "@/components/BuildsSettingsModal"

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
    const { state: backend } = useBackend()
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
    const [builds, setBuilds] = useState<Build[] | undefined>(undefined)
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
            setBuilds(result.data)
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

    const [openedId, setOpenedId] = useState<number | null>(initialOpenedId ? Number(initialOpenedId) : null)

    const tableRef = useRef<HTMLDivElement>(null)

    const { account } = useAuth()
    const isClaimed = useMemo(() =>
        account?.ClaimedProfiles.find(p => p.Uid === Number(uid)) !== undefined,
    [uid, account?.ClaimedProfiles])

    const [bindPopoverOpen, setBindPopoverOpen] = useState(false)

    const { retry: refreshClaim, ...profileClaimState } = useAsyncRetry(async () => {
        if (!uid) return undefined
        if (!account) return undefined
        return await getProfileClaim(Number(uid))
    }, [uid, account])
    const profileClaim = useMemo(() => profileClaimState.value?.data, [profileClaimState.value?.data])

    const [buildsSettingsOpened, { open: openBuildsSettings, close: closeBuildsSettings }] = useDisclosure(false)

    const doro = useMemo(() => backend?.data?.events?.doro ?? [], [backend?.data?.events?.doro])
    const doroMode = useMemo(() => doro.length > 0, [doro.length])

    return (<>
        <BuildsSettingsModal
            opened={buildsSettingsOpened}
            onClose={closeBuildsSettings}
            onBuildsUpdated={() => {
                charactersState.retry()
            }}
            uid={Number(uid)} />

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
        {profileClaim && <>
            <Center>
                <Alert variant="light" color="yellow" title="Profile claim in progress" icon={<IconKeyFilled />} mb="md" w="640px">
                    <Stack gap="xs">
                        <Group gap="xs">
                            <Text fz="xl" fw="bold">Time left to bind this profile: </Text>
                            <Code fz="xl" fw="bold">
                                <Timer title="" isEnabled={true}
                                    endTime={Math.floor((Math.abs(new Date(profileClaim.createdAt).getTime() + 7200 * 1000 - new Date().getTime())) / 1000)}
                                    onTimerEnd={refreshClaim} />
                            </Code>
                        </Group>
                        <Group gap="xs">
                            <Text fz="xl" fw="bold">Your binding code is: </Text>
                            <Code fz="xl" fw="bold">{profileClaim.secret}</Code>
                            <ActionIcon variant="subtle" c="white" onClick={async () => {
                                await navigator.clipboard.writeText(profileClaim.secret)
                                notifications.show({
                                    message: `Copied binding code to clipboard`,
                                    color: "blue",
                                    autoClose: 4000,
                                    icon: <IconCheck size={16} />,
                                    position: "bottom-center"
                                })
                            }}>
                                <IconCopy />
                            </ActionIcon>
                        </Group>
                        <Text>Add binding code to your in-game signature and press the Update button.</Text>
                        <Text>Be aware it might take around 5 minutes for in-game changes to be reflected
                            on the profile page. To update it instantly, log out of the game.</Text>
                    </Stack>
                </Alert>
            </Center>
        </>}
        {profile && <>
            <title>{`${profile?.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${profile?.Nickname}'s Profile | Inter-Knot`} />
                <Stack>
                    <Group justify="flex-end" gap="xs">
                        <Text c="dimmed">Last updated {timeAgoIntl(profile.UpdatedAt)}</Text>
                        {backend?.data && !backend.data.params.update_enabled &&
                            <Tooltip label={backend.data.params.update_disabled_msg} withArrow portalProps={{ reuseTargetNode: true }}>
                                <Button rightSection={<IconReload />} disabled>Update</Button>
                            </Tooltip>
                        }
                        {backend?.data && backend.data.params.update_enabled &&
                            <Button rightSection={<IconReload />} disabled={!canUpdate} onClick={() => {
                                setCanUpdate(false)
                                setUpdateRequested(true)
                                profileState.retry()
                                leaderboardsState.retry()
                                if (profileClaim) {
                                    window.location.reload()
                                }
                            }}>
                                <Timer key={uid} title="Update" isEnabled={!canUpdate}
                                    endTime={ttl === 0 ? 60 : ttl}
                                    onTimerEnd={() => {
                                        setCanUpdate(true)
                                        setUpdateRequested(false)
                                    }} />
                            </Button>
                        }
                        { account && <>
                            { !isClaimed
                                ? <Popover withArrow withinPortal position="top"
                                    opened={bindPopoverOpen} onChange={setBindPopoverOpen}>
                                    <Popover.Target>
                                        <Tooltip label={profileClaim ? "A claim is already in progress!" : "Bind profile"} withinPortal>
                                            <ActionIcon disabled={profileClaim !== undefined} onClick={() => setBindPopoverOpen(true)}>
                                                <IconKeyFilled />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Text>Do you want to bind this profile?</Text>
                                        <Flex gap="sm" justify="stretch">
                                            <Button mt="sm" flex="1 0" leftSection={<IconCheck />}
                                                onClick={async () => {
                                                    const claim = await initProfileClaim(Number(uid))
                                                    if (claim.success) {
                                                        setBindPopoverOpen(false)
                                                        refreshClaim()
                                                    }
                                                }}>Bind</Button>
                                            <Button mt="sm" variant="light" onClick={() => setBindPopoverOpen(false)}>Cancel</Button>
                                        </Flex>
                                    </Popover.Dropdown>
                                </Popover>
                                : <Tooltip label="Lock profile updates" withinPortal>
                                        <ActionIcon onClick={() => {
                                            // TODO: send lock to backend
                                        }}>
                                            <IconLockFilled />
                                        </ActionIcon>
                                    </Tooltip>
                            }
                        </>}
                        <Tooltip label="Mark as favorite" withinPortal>
                            <ActionIcon onClick={toggleIsFavorite}>
                                {favoriteUsers.includes(Number(uid)) ? <IconStarFilled /> : <IconStar />}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Open on Enka.Network" withinPortal>
                            <ActionIcon style={{ fontFamily: "shicon", fontSize: "1.5rem" }}
                                component="a" href={`https://enka.network/zzz/${uid}`} target="_blank">
                                {""}
                            </ActionIcon>
                        </Tooltip>
                        {account && isClaimed &&
                            <ActionIcon onClick={openBuildsSettings}>
                                <IconSettingsFilled />
                            </ActionIcon>
                        }
                    </Group>
                    <Stack gap="0px" align="center">
                        <UserHeaderMemoized user={profile} showDescription={profile.Description !== ""} />
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
                                leaderboardsState.error && <Center m="md">Failed to load leaderboards. {leaderboardsState.error.message}</Center>
                            }
                        </Collapse>
                        <Button variant="transparent" className="lb-expand-button" leftSection={opened ? <IconChevronUp /> : <IconChevronDown />} onClick={toggle}>
                            Leaderboards
                        </Button>
                    </Stack>


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
                        {builds?.length !== 0 &&
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
                                                        render: (b, r) =>
                                                            !b.IsPublic
                                                                ? <Tooltip label="Hidden build" withinPortal><IconEyeOff /></Tooltip>
                                                                : <Text>{((page ?? 1) - 1) * limitNum + r + 1}</Text>,
                                                    },
                                                    {
                                                        accessor: "Name",
                                                        title: "Name",
                                                        cellsStyle: () => ({ maxWidth: "30%" }),
                                                        render: (b) => {
                                                            const localizedName = getLocalString(b.Character.Name)
                                                            const displayName = b.Name ?? localizedName

                                                            // FIXME: needs proper img replacing solution
                                                            const url = b.Character.Skin ? b.Character.Skin.CircleIconUrl : b.Character.CircleIconUrl
                                                            const src = doroMode && doro.includes(b.Character.Id)
                                                                ? url.replace("enka.network", "cdn.interknot.space/aprilfools")
                                                                : url

                                                            return (
                                                                <Group gap="sm" wrap="nowrap">
                                                                    <Image src={src} h="32px" />
                                                                    <div className="chip">{getLevel(b.Character.Level)}</div>
                                                                    { displayName !== localizedName
                                                                        ? <>
                                                                            <Text className="table-name-display" style={{ whiteSpace: "nowrap" }}>{displayName}</Text>
                                                                            <Text className="table-name-local" style={{ whiteSpace: "nowrap" }}>{localizedName}</Text>
                                                                        </>
                                                                        : <Text style={{ whiteSpace: "nowrap" }}>{displayName}</Text>
                                                                    }
                                                                </Group>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        accessor: "MindscapeLevel",
                                                        title: "Mindscape",
                                                        render: (b) => (
                                                            <div className="chip mindscape-chip" style={{ padding: `0.125rem ${(b.Character.MindscapeLevel / 5 + 1)}rem` }}
                                                                data-level={b.Character.MindscapeLevel}>
                                                                <Text fw={700}>{b.Character.MindscapeLevel}</Text>
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        accessor: "Weapon",
                                                        title: "Weapon",
                                                        render: (b) => <WeaponCell weapon={b.Character.Weapon} />
                                                    },
                                                    {
                                                        accessor: "DriveDisksSet",
                                                        title: "Drive Discs",
                                                        render: (b) => <DriveDiscsCell sets={b.Character.DriveDisksSet} />
                                                    },
                                                    {
                                                        accessor: "CritValue",
                                                        title: cvEnabled ? "Crit Value" : "Crit Ratio",
                                                        cellsStyle: () => ({
                                                            width: "calc(10rem * var(--mantine-scale))",
                                                            background: "rgba(0 0 0 / 15%)"
                                                        }),
                                                        render: (b) => (
                                                            <CritCell
                                                                cr={b.Character.Stats.find((p) => p.Id === 20101)?.formatted.replace("%", "") ?? ""}
                                                                cd={b.Character.Stats.find((p) => p.Id === 21101)?.formatted.replace("%", "") ?? ""}
                                                                cv={b.Character.CritValue}
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
                                                        render: (b: Build) => {
                                                            const stats = getTopStats(b.Character)
                                                            const prop = stats[idx]
                                                            return prop ? <PropertyCell key={prop.Id} prop={prop} /> : null
                                                        }
                                                    }))
                                                ]
                                            }
                                        ]}
                                        rowExpansion={{
                                            allowMultiple: true,
                                            content: ({ record: build }) => (
                                                <DataProvider data={{
                                                    owner: profile,
                                                    build: build
                                                } satisfies ICardContext}>
                                                    <LeaderboardProvider characterId={build.Character.Id} buildId={build.Id}>
                                                        <CardSettingsProvider>
                                                            <CharacterCardContainer parentRef={tableRef} cardProps={{
                                                                uid: Number(uid),
                                                                username: profile.Nickname,
                                                                build: build
                                                                // onFinishEditingImage(customization) {
                                                                //     setIsEditingImage(false)
                                                                // },
                                                            }} />
                                                            <Stack m="md">
                                                                <CardFooter
                                                                    onBuildsUpdated={() => charactersState.retry()} />
                                                            </Stack>
                                                        </CardSettingsProvider>
                                                    </LeaderboardProvider>
                                                </DataProvider>
                                            )
                                        }}
                                        rowClassName={(record) => record.IsPublic ? undefined : "hidden-build"}
                                        rowStyle={(record) => ({
                                            opacity: record.IsPublic ? 1 : 0.25,
                                        })}
                                        records={builds}
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
                                                        setQueryParams({ cursor: `gte:crit_value=${builds?.[0].Character.CritValue};id=${builds?.[0].Id}` })
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
                        }
                        {builds?.length === 0 &&
                            <Center>
                                <Alert variant="light" color="blue" title="No characters data found!" icon={<IconInfoCircle />}
                                    maw="50%">
                                    <Text>
                                        If you're adding your profile to Inter-Knot for the first time, please check that your
                                        <Text component="a" c="blue"
                                            href="https://zenless-zone-zero.fandom.com/wiki/Profile#:~:text=Agent%20Showcase%3A%20Showcase%20up%20to%206%20unlocked%20Agents%20and%20their%20current%20Level."
                                            target="_blank"> Agents Showcase</Text> is not empty and refresh your profile on Inter-Knot with <Text span c="blue">Update</Text> button.
                                        Or check your filters query.
                                    </Text>
                                </Alert>
                            </Center>
                        }
                    </Stack>

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
                        {discs?.length !== 0 &&
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
                                                        hidden: !cvEnabled,
                                                        cellsStyle: () => ({
                                                            width: "calc(10rem * var(--mantine-scale))",
                                                            background: "rgba(0 0 0 / 15%)",
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
                        }
                    </Stack>
                </Stack>
        </>
        }
    </>)
}