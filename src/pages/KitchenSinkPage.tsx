import { Stack, Loader, Tabs, Title, Text, Code } from "@mantine/core"
import { useAsync } from "react-use"
import { useMemo } from "react"
import { getCharacters, getProfile } from "@/api/data"
import "@components/cells/styles/CritCell.css"
import "@components/cells/styles/WeaponCell.css"
import "./styles/TestPage.css"
import { UserHeader } from "@/components/UserHeader/UserHeader"
// import BuildActions from "@/components/BuildActions"
import { DataProvider } from "@/components/DataProvider"
import { ICardContext } from "@/components/CharacterCard/CharacterCard"

const uid = 1500438496

function ApplicationTab() {
    return <Stack p="md">
        <Title>Application</Title>
    </Stack>
}

function ProfileTab() {
    const profileState = useAsync(async () => {
        return await getProfile(uid)
    }, [uid])
    const profile = useMemo(() => profileState.value?.data, [profileState.value?.data])

    return <Stack p="md">
        <Title>Profile</Title>
        {
            profileState.loading && <Loader />
        }
        {
            profile && <> 
                <Title order={2}>UserHeader</Title>
                <Text>Variant: <Code>default</Code></Text>
                <UserHeader user={profile} />
                <Text>Variant: <Code>compact</Code></Text>
                <UserHeader user={profile} variant="compact" />
            </>
        }
    </Stack>
}

function BuildsTab() {
    const buildsState = useAsync(async () => getCharacters({ uid }), [])
    const builds = useMemo(() => buildsState.value?.data, [buildsState.value?.data])
    const build = useMemo(() => builds ? builds[0] : undefined, [builds])

    return <Stack p="md">
        { buildsState.loading && <Loader /> }
        { builds && <></>
            // <DataProvider data={{
            //     build: build
            // } satisfies Partial<ICardContext>}>
            //     <Stack>
            //         <BuildActions location="modal" />
            //         <BuildActions location="footer" />
            //     </Stack>
            // </DataProvider>
        }
    </Stack>
}

export default function KitchenSinkPage() {
    return (<>
        <Tabs defaultValue="main">
            <Tabs.List>
                <Tabs.Tab value="main">Application</Tabs.Tab>
                <Tabs.Tab value="profile">Profile</Tabs.Tab>
                <Tabs.Tab value="builds">Builds</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="main"><ApplicationTab /></Tabs.Panel>
            <Tabs.Panel value="profile"><ProfileTab /></Tabs.Panel>
            <Tabs.Panel value="builds"><BuildsTab /></Tabs.Panel>
        </Tabs>
        
    </>)
}