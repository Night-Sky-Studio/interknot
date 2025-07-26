import { useParams } from "react-router"
import { UserHeaderMemorized } from "../components/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center, Collapse, Alert, Text, Tooltip } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { CharactersTableMemorized } from "../components/CharactersTable"
import { useEffect, useState } from "react"
import { useAsyncRetry, useSearchParam } from "react-use"
import { getUser, getUserLeaderboards } from "../api/data"
import { IconChevronDown, IconChevronUp, IconInfoCircle, IconReload, IconStar, IconStarFilled } from "@tabler/icons-react"
import Timer from "../components/Timer"
import "./styles/ProfilePage.css"
import { LeaderboardGridMemorized } from "../components/LeaderboardGrid"
import { LeaderboardProfile, Profile, ProfileInfo } from "@interknot/types"
import LeaderboardProvider from "../components/LeaderboardProvider"

export default function ProfilePage(): React.ReactElement {
    const updateEnabled = true

    const { uid } = useParams()
    const initialOpenedId = useSearchParam("openedId")
    
    const [needsUpdate, setNeedsUpdate] = useState(false)
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
        if (!profileBackup) {
            return undefined
        }
        const result = await getUserLeaderboards(Number(uid), needsUpdate)
        if (result) {
            setLeaderboardsBackup(result) // Store successful result as backup
        }
        return result
    }, [uid, profileBackup, needsUpdate])

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
        setNeedsUpdate((profileBackup?.Ttl ?? 0) !== 0)
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
    }, [leaderboardsState.value, leaderboardsState.error])

    useEffect(() => {
        if (profileBackup)
            console.log(`User ${profileBackup.Information.Uid}, TTL: ${profileBackup.Ttl}, needsUpdate: ${needsUpdate}, favoriteUsers: ${favoriteUsers.join(',')}`)
    }, [profileBackup, needsUpdate, favoriteUsers])

    const [openedId, setOpenedId] = useState<number | null>(initialOpenedId ? Number(initialOpenedId) : null)

    return (<> 
        {userState.loading && !profileBackup && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Center><Loader /></Center>
        </>}
        {userState.error && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Alert variant="light" color="red" title="Failed to load profile" icon={<IconInfoCircle />}>
                <Text ff="monospace">Error: {userState.error.message}</Text>
            </Alert>
        </>}
        {profileBackup && <>
            <title>{`${profileBackup?.Information.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${profileBackup?.Information.Nickname}'s Profile | Inter-Knot`} />
            <LeaderboardProvider>
                <Stack>
                    <Group justify="flex-end" gap="xs">
                        {!updateEnabled && 
                            <Tooltip label="Enka is on maintenance, updates are temporarily disabled" withArrow portalProps={{ reuseTargetNode: true }}>
                                <Button rightSection={<IconReload />} disabled>Update</Button>
                            </Tooltip>
                        }
                        {updateEnabled &&
                            <Button rightSection={<IconReload />} disabled={!updateEnabled || needsUpdate} onClick={() => {
                                setNeedsUpdate(true)
                                userState.retry()
                                leaderboardsState.retry()
                            }}>
                                <Timer key={uid} title="Update" isEnabled={needsUpdate}
                                    endTime={profileBackup.Ttl === 0 ? 60 : profileBackup.Ttl} 
                                    onTimerEnd={() => {
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
                    <CharactersTableMemorized uid={profileBackup.Information.Uid} username={profileBackup.Information.Nickname} 
                        characters={profileBackup.Characters} lbAgents={leaderboardsState.value?.Agents} openedId={openedId} />
                </Stack>
            </LeaderboardProvider>
        </>
    }
    </>)
}