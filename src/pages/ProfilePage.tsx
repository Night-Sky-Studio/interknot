import { useParams } from "react-router"
import { UserHeaderMemorized } from "../components/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import CharactersTable from "../components/CharactersTable"
import { useEffect, useState } from "react"
import { ProfileInfo } from "@interknot/types"
import { useAsyncRetry } from "react-use"
import { getUser } from "../api/data"
import { IconReload } from "@tabler/icons-react"
import Timer from "../components/Timer"

export default function ProfilePage(): React.ReactElement {
    let { uid } = useParams()
    
    let [needsUpdate, setNeedsUpdate] = useState(false)
    let [savedUsers, setSavedUsers] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers" })
    
    const userState = useAsyncRetry(async () => {
        return await getUser(Number(uid), needsUpdate)
    }, [uid])

    useEffect(() => {
        if (!savedUsers?.find(u => u.Uid.toString() === uid) && userState.value) { 
            setSavedUsers([...savedUsers ?? [], userState.value.Information])
        }
        setNeedsUpdate(userState.value?.Ttl !== 0)
    }, [userState.value])

    return (<> 
            <title>{`${userState.value?.Information.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${userState.value?.Information.Nickname}'s Profile | Inter-Knot`} />
            <Stack>
                {userState.loading && !userState.value &&
                    <Center><Loader /></Center>
                }
                {userState.value && <>
                    <Group justify="flex-end">
                        <Button rightSection={<IconReload />} disabled={needsUpdate} onClick={() => {
                            setNeedsUpdate(true)
                            userState.retry()
                        }}>
                            <Timer key={uid} title="Update" endTime={userState.value.Ttl} isEnabled={needsUpdate}
                                onTimerEnd={() => {
                                    setNeedsUpdate(false)
                                }} />
                        </Button>
                        <ActionIcon style={{ fontFamily: "shicon", fontSize: "1.5rem"}} 
                            component="a" href={`https://enka.network/zzz/${uid}`} target="_blank">
                            {""}
                        </ActionIcon>
                    </Group>
                    <UserHeaderMemorized user={userState.value.Information} showDescription />
                    <CharactersTable uid={userState.value.Information.Uid} username={userState.value.Information.Nickname} 
                        characters={userState.value.Characters} />
                </>}
            </Stack>
        </>
    )
}