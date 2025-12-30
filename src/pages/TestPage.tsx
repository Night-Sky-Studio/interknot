import { Stack, Loader } from "@mantine/core"
import { useAsync } from "react-use"
import { useMemo } from "react"
import { getProfile } from "@/api/data"
import "@components/cells/styles/CritCell.css"
import "@components/cells/styles/WeaponCell.css"
import "./styles/TestPage.css"
import { UserHeader } from "@/components/UserHeader/UserHeader"

export default function TestPage() {
    // 1500278107
    const uid = Number(1500438496)

    const profileState = useAsync(async () => {
        return await getProfile(uid)
    }, [uid])

    const profile = useMemo(() => profileState.value?.data, [profileState.value?.data])

    return <Stack>
        {
            profileState.loading && <Loader />
        }
        {
            profile && <UserHeader user={profile} />
        }
    </Stack>
}