import { useParams } from "react-router"
import { UserHeaderMemorized } from "../components/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center, Collapse, Alert, Text, Tooltip, MultiSelect, Image } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { CharactersTableMemorized } from "../components/CharactersTable"
import { useEffect, useMemo, useState } from "react"
import { useAsyncRetry, useSearchParam } from "react-use"
import { getUser, getUserLeaderboards } from "../api/data"
import { IconChevronDown, IconChevronUp, IconInfoCircle, IconReload, IconStar, IconStarFilled } from "@tabler/icons-react"
import Timer from "../components/Timer"
import "./styles/ProfilePage.css"
import { LeaderboardGridMemorized } from "../components/LeaderboardGrid"
import { Error as BackendError, LeaderboardProfile, Profile, ProfileInfo } from "@interknot/types"
import LeaderboardProvider from "../components/LeaderboardProvider"
import { useBackend } from "../components/BackendProvider"
import { ZenlessIcon } from "../components/icons/Icons"
import { useSettings } from "../components/SettingsProvider"

export default function ProfilePage(): React.ReactElement {
    const { uid } = useParams()
    const initialOpenedId = useSearchParam("openedId")
    const backend = useBackend()
    const { getLocalString } = useSettings()
    
    const [needsUpdate, setNeedsUpdate] = useState(false)
    const [canUpdate, setCanUpdate] = useState(true)
    const [savedUsers, setSavedUsers] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [favoriteUsers, setFavoriteUsers] = useLocalStorage<number[]>({ key: "favoriteUsers", defaultValue: [] })
    const [profileBackup, setProfileBackup] = useState<Profile | null>(null)
    const [leaderboardsBackup, setLeaderboardsBackup] = useState<LeaderboardProfile | null>(null)

    const userState = useAsyncRetry(async () => {
        const result = await getUser(Number(uid), needsUpdate)
        
        setProfileBackup(result) // Store successful result as backup
        return result
    }, [uid, needsUpdate])

    const leaderboardsState = useAsyncRetry(async () => {
        if (!userState.value) {
            return undefined
        }
        const result = await getUserLeaderboards(Number(uid), needsUpdate)
        if (result) {
            setLeaderboardsBackup(result) // Store successful result as backup
        }
        return result
    }, [uid, userState.value, needsUpdate])

    const [opened, { toggle }] = useDisclosure(true)
    
    const toggleIsFavorite = () => {
        const userId = Number(uid)
        if (favoriteUsers.includes(userId)) {
            setFavoriteUsers(favoriteUsers.filter(u => u !== userId))
        } else {
            setFavoriteUsers([...favoriteUsers, userId])
        }
    }

    useEffect(() => {
        if (!savedUsers?.find(u => u.Uid.toString() === uid) && profileBackup) { 
            setSavedUsers([...savedUsers ?? [], { ...profileBackup.Information }])
        }
        setCanUpdate((profileBackup?.Ttl ?? 0) == 0)
    }, [profileBackup])

    // Initialize backups when profile loads successfully
    useEffect(() => {
        if (profileBackup && !userState.error) {
            setProfileBackup(profileBackup)
        }
    }, [profileBackup, userState.error])

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
            console.log(`User ${profileBackup.Information.Uid}, TTL: ${profileBackup.Ttl}, needsUpdate: ${needsUpdate}, canUpdate: ${canUpdate}, favoriteUsers: ${favoriteUsers.join(',')}`)
    }, [profileBackup, needsUpdate, favoriteUsers])

    const [openedId, setOpenedId] = useState<number | null>(initialOpenedId ? Number(initialOpenedId) : null)

    const errorHandler = (error: string) => {
        // try parse
        try {
            const parsedError = JSON.parse(error) as unknown as BackendError
            return `Error ${parsedError.Code}: ${parsedError.Message}\n${parsedError.Details}`
        } catch {
            return `Error: ${error}`
        }
    }

    const filters = useMemo(() => backend.state?.filters, [backend.state?.filters])
    const filterGroups = useMemo(() => {
        const result = Object.entries(filters ?? []).map(([g, f]) => ({
            group: g,
            items: (f.map(v => ({ 
                value: `${g}:${v.value}`,
                label: getLocalString(v.label),
            })))
        }))
        return result 
    }, [filters])
    const filterItems = useMemo(() => {
        const result: Map<string, { label: string, value: string, img?: string }> = new Map()

        Object.entries(filters ?? []).forEach(([g, f]) => {
            f.forEach(v => result.set(`${g}:${v.value}`, { label: getLocalString(v.label), value: v.value, img: v.img }))
        })

        return result
    }, [filters])

    return (<> 
        {userState.loading && !profileBackup && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Center><Loader /></Center>
        </>}
        {userState.error && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Alert variant="light" color="red" title="Failed to load profile" icon={<IconInfoCircle />} mb="md">
                <Text ff="monospace">{errorHandler(userState.error.message)}</Text>
            </Alert>
        </>}
        {profileBackup && <>
            <title>{`${profileBackup?.Information.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${profileBackup?.Information.Nickname}'s Profile | Inter-Knot`} />
            <LeaderboardProvider>
                <Stack>
                    <Group justify="flex-end" gap="xs">
                        {backend.state && !backend.state.params.update_enabled && 
                            <Tooltip label={backend.state?.params.update_disabled_msg} withArrow portalProps={{ reuseTargetNode: true }}>
                                <Button rightSection={<IconReload />} disabled>Update</Button>
                            </Tooltip>
                        }
                        {backend.state && backend.state.params.update_enabled &&
                            <Button rightSection={<IconReload />} disabled={!canUpdate} onClick={() => {
                                setCanUpdate(false)
                                setNeedsUpdate(true)
                                userState.retry()
                                leaderboardsState.retry()
                            }}>
                                <Timer key={uid} title="Update" isEnabled={!canUpdate}
                                    endTime={profileBackup.Ttl === 0 ? 60 : profileBackup.Ttl} 
                                    onTimerEnd={() => {
                                        setCanUpdate(true)
                                        setNeedsUpdate(false)
                                    }} />
                            </Button>
                        }
                        <ActionIcon onClick={toggleIsFavorite}>
                            { favoriteUsers.includes(Number(uid)) ? <IconStarFilled /> : <IconStar /> }
                        </ActionIcon>
                        <ActionIcon style={{ fontFamily: "shicon", fontSize: "1.5rem"}} 
                            component="a" href={`https://enka.network/zzz/${uid}`} target="_blank">
                            {""}
                        </ActionIcon>
                    </Group>
                    <Stack gap="0px" align="center">
                        <UserHeaderMemorized user={profileBackup.Information} showDescription={profileBackup.Information.Description !== ""} />
                        <Collapse in={opened} className="leaderboards" data-open={opened}>
                            {
                                leaderboardsState.loading && <Center m="md"><Loader /></Center>
                            }
                            {
                                leaderboardsBackup &&
                                    <LeaderboardGridMemorized 
                                        profile={leaderboardsBackup} 
                                        characters={profileBackup.Characters}
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
                    {profileBackup.Characters.length === 0 &&
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
                    {profileBackup.Characters.length !== 0 &&
                        <Stack>
                            {filterGroups && 
                                <MultiSelect data={filterGroups} 
                                    renderOption={({ option }) => {
                                        const item = filterItems.get(option.value)
                                        if (!item) return <Text>{ option.value }</Text>
                                        const hasIcon = /[M|R]\d/.test(option.label)
                                        return <Group>
                                            { item?.img !== undefined && <Image src={item.img} w="32px" h="32px" /> }
                                            { item?.img === undefined && !hasIcon && <ZenlessIcon id={Number(item.value)} size={18} color="white" /> }
                                            <Text>{ item?.label }</Text>
                                        </Group>
                                    }}
                                    dropdownOpened={true}
                                    maxDropdownHeight={512}
                                    styles={{
                                        dropdown: { 
                                            boxShadow: "rgba(0 0 0 / 50%) 0px 16px 32px" 
                                        }, 
                                        group: {
                                            marginBottom: "0.5rem"
                                        },
                                        groupLabel: { 
                                            fontWeight: 600, 
                                            color: "white",
                                            fontSize: "1.25rem"
                                        } 
                                    }}
                                    placeholder="Filter by..." searchable clearable hidePickedOptions />
                            }
                            <CharactersTableMemorized uid={profileBackup.Information.Uid} username={profileBackup.Information.Nickname} 
                                characters={profileBackup.Characters} lbAgents={leaderboardsState.value?.Agents} openedId={openedId} />
                        </Stack>
                    }
                </Stack>
            </LeaderboardProvider>
        </>
    }
    </>)
}