import { useParams } from "react-router"
import { UserHeaderMemorized } from "../components/UserHeader"
import { Stack } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import CharactersTable from "../components/CharactersTable"
import { useEffect } from "react"
import { Profile } from "@interknot/types"
import { useAsync } from "react-use"
import { getUser } from "../api/data"

export default function ProfilePage(): React.ReactElement {
    let { uid } = useParams()

    let [savedUsers, setSavedUsers] = useLocalStorage<Profile[]>({ key: "savedUsers" })

    const userState = useAsync(async () => {
        return await getUser(Number(uid))
    }, [uid])

    useEffect(() => {
        if (!savedUsers?.find(u => u.Information.Uid.toString() === uid) && userState.value) { 
            setSavedUsers([...savedUsers ?? [], userState.value])
        }
    }, [userState.value])

    return (
        <Stack style={{ minHeight: "150vh" }}>
            {userState.value && <>
                <UserHeaderMemorized user={userState.value.Information} />
                <CharactersTable uid={userState.value.Information.Uid} username={userState.value.Information.Nickname} 
                    characters={userState.value.Characters} />
            </>}
        </Stack>
    )
}