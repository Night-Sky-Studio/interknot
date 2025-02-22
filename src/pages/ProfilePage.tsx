import { useParams } from "react-router"
import UserHeader from "../components/UserHeader"
import { Stack } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import CharactersTable from "../components/CharactersTable"
import { useEffect } from "react"
import { Profile } from "../../backend/data/types/Profile"
import { useAsync } from "react-use"
import { getUser } from "../api/data"

export default function ProfilePage(): React.ReactElement {
    let { uid } = useParams()

    let [savedUsers, setSavedUsers] = useLocalStorage<Profile[]>({ key: "savedUsers" })

    const userState = useAsync(async () => {
        return await getUser(Number(uid))
    }, [uid])

    useEffect(() => {
        if (!savedUsers?.find(u => u.Uid.toString() === uid) && userState.value) { 
            setSavedUsers([...savedUsers ?? [], userState.value])
            console.log(userState.value)
        }
    }, [userState.value])

    return (
        <Stack>
            {userState.value && <>
                <UserHeader user={userState.value} />
                <CharactersTable uid={userState.value.Uid} username={userState.value.Information.Nickname} 
                    characters={userState.value.Characters} />
            </>}
        </Stack>
    )
}