import { useParams } from "react-router"
import { UserHeaderMemorized } from "../components/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center, Collapse, Alert, Text } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { CharactersTableMemorized } from "../components/CharactersTable"
import { useEffect, useState } from "react"
import { useAsyncRetry, useSearchParam } from "react-use"
import { getUser, getUserLeaderboards } from "../api/data"
import { IconChevronDown, IconChevronUp, IconInfoCircle, IconReload, IconStar, IconStarFilled } from "@tabler/icons-react"
import Timer from "../components/Timer"
import "./styles/ProfilePage.css"
import { LeaderboardGridMemorized } from "../components/LeaderboardGrid"
import { ProfileInfo } from "@interknot/types"

export default function ProfilePage(): React.ReactElement {
    const { uid } = useParams()
    const initialOpenedId = useSearchParam("openedId")
    
    const [needsUpdate, setNeedsUpdate] = useState(false)
    const [savedUsers, setSavedUsers] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [favoriteUsers, setFavoriteUsers] = useLocalStorage<number[]>({ key: "favoriteUsers", defaultValue: [] })

    const userState = useAsyncRetry(async () => {
        return await getUser(Number(uid), needsUpdate)
    }, [uid])

    const leaderboardsState = useAsyncRetry(async () => {
        return await getUserLeaderboards(Number(uid), needsUpdate)
    }, [uid])

    const [opened, { toggle }] = useDisclosure(true)

    const [isFavorite, setIsFavorite] = useState(false)
    
    useEffect(() => {
        if (uid) {
            setIsFavorite(favoriteUsers.includes(Number(uid)))
        }
    }, [uid, favoriteUsers])
    
    const toggleIsFavorite = () => {
        const userId = Number(uid)
        if (favoriteUsers.includes(userId)) {
            setFavoriteUsers(favoriteUsers.filter(u => u !== userId))
        } else {
            setFavoriteUsers([...favoriteUsers, userId])
        }
    }

    useEffect(() => {
        if (!savedUsers?.find(u => u.Uid.toString() === uid) && userState.value) { 
            setSavedUsers([...savedUsers ?? [], { ...userState.value.Information }])
        }
        setNeedsUpdate((userState.value?.Ttl ?? 0) !== 0)
    }, [userState.value])

    useEffect(() => {
        if (userState.value)
            console.log(`User ${userState.value.Information.Uid}, TTL: ${userState.value.Ttl}, needsUpdate: ${needsUpdate}, isFavorite: ${isFavorite}, favoriteUsers: ${favoriteUsers.join(',')}`)
    }, [userState.value, needsUpdate, isFavorite, favoriteUsers])

    const [openedId, setOpenedId] = useState<number | null>(initialOpenedId ? Number(initialOpenedId) : null)

    return (<> 
        {userState.loading && !userState.value && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Center><Loader /></Center>
        </>}
        {userState.error && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Alert variant="light" color="red" title="Failed to load profile" icon={<IconInfoCircle />}>
                <Text ff="monospace">Error: {userState.error.message}</Text>
            </Alert>
        </>}
        {userState.value && <>
            <title>{`${userState.value?.Information.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${userState.value?.Information.Nickname}'s Profile | Inter-Knot`} />
            <Stack>
                <Group justify="flex-end" gap="xs">
                    <Button rightSection={<IconReload />} disabled={needsUpdate} onClick={() => {
                        setNeedsUpdate(true)
                        userState.retry()
                        leaderboardsState.retry()
                    }}>
                        <Timer key={uid} title="Update" isEnabled={needsUpdate}
                            endTime={userState.value.Ttl === 0 ? 60 : userState.value.Ttl} 
                            onTimerEnd={() => {
                                setNeedsUpdate(false)
                            }} />
                    </Button>
                    <ActionIcon onClick={toggleIsFavorite}>
                        { isFavorite ? <IconStarFilled /> : <IconStar /> }
                    </ActionIcon>
                    <ActionIcon style={{ fontFamily: "shicon", fontSize: "1.5rem"}} 
                        component="a" href={`https://enka.network/zzz/${uid}`} target="_blank">
                        {""}
                    </ActionIcon>
                </Group>
                <Stack gap="0px" align="center">
                    <UserHeaderMemorized user={userState.value.Information} showDescription={userState.value.Information.Description !== ""} />
                    <Collapse in={opened} className="leaderboards" data-open={opened}>
                        {
                            leaderboardsState.loading && <Center m="md"><Loader /></Center>
                        }
                        {
                            !leaderboardsState.loading && !leaderboardsState.error && 
                                <LeaderboardGridMemorized 
                                    profile={leaderboardsState.value} 
                                    characters={userState.value.Characters}
                                    onProfileClick={(agentId) => {
                                        setOpenedId(agentId === openedId ? null : agentId)
                                    }} />
                        }
                        {
                            leaderboardsState.error && <Center m="md">Failed to load leaderboards</Center>
                        }
                    </Collapse>
                    <Button variant="transparent" className="lb-expand-button" leftSection={opened ? <IconChevronUp /> : <IconChevronDown />} onClick={toggle}>
                        Leaderboards
                    </Button>
                </Stack>
                <CharactersTableMemorized uid={userState.value.Information.Uid} username={userState.value.Information.Nickname} 
                    characters={userState.value.Characters} lbAgents={leaderboardsState.value?.Agents} openedId={openedId} />
            </Stack>
        </>
    }
    </>)
}