import { Stack, Loader, Tabs, Title, Text, Code, Divider, Flex } from "@mantine/core"
import { useAsync } from "react-use"
import { useMemo } from "react"
import { getCharacters, getDriveDiscs, getProfile } from "@/api/data"
import "@components/cells/styles/CritCell.css"
import "@components/cells/styles/WeaponCell.css"
import "./styles/TestPage.css"
import { UserHeader } from "@/components/UserHeader/UserHeader"
import { Team } from "@components/Team/Team.tsx"
import DriveDiscCard from "@/components/DriveDiscCard/DriveDiscCard";
// import BuildActions from "@/components/BuildActions"
// import { DataProvider } from "@/components/DataProvider"
// import { ICardContext } from "@/components/CharacterCard/CharacterCard"

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

function DiscsTab() {
    const discsState = useAsync(async () => await getDriveDiscs({ uid, limit: 4 }), [uid])
    const discs = useMemo(() => discsState.value?.data, [discsState.value?.data])


    return <Stack p="md">
        <Title>Drive Discs</Title>

        { discsState.loading && <Loader /> }
        { discs && <>
                <Title order={2}>Drive Disc Card</Title>
                <Flex gap="md">
                    { 
                        discs.map(dd => <DriveDiscCard key={dd.Uid} disc={dd} />)
                    }
                </Flex>
            </>
        }
           
    </Stack>
}

function BuildsTab() {
    const buildsState = useAsync(async () => getCharacters({ uid }), [])
    const builds = useMemo(() => buildsState.value?.data, [buildsState.value?.data])
    const agent = useMemo(() => builds?.[0]?.Character, [builds])

    return <Stack p="md">
        <Title>Builds</Title>
        { buildsState.loading && <Loader /> }
        { builds && agent && <Stack>
            <Text>Compact: <Code>false</Code></Text>
            <Team h="128px" team={[ 
                { 
                    Character: agent, 
                    MindscapeLevel: 6,
                    Weapon: agent.Weapon!,
                    WeaponRefinement: 5,
                    DriveDiscSet: agent.DriveDisksSet[0].Set 
                },
                {
                    Speciality: "Support",
                    DriveDiscSet: agent.DriveDisksSet[1].Set
                }
            ]} />

            <Text>Compact: <Code>true</Code></Text>
            <Team h="128px" compact team={[ 
                { 
                    Character: agent, 
                    MindscapeLevel: 6,
                    Weapon: agent.Weapon!,
                    WeaponRefinement: 5,
                    DriveDiscSet: agent.DriveDisksSet[0].Set 
                },
                {
                    Speciality: "Support",
                    DriveDiscSet: agent.DriveDisksSet[1].Set
                }
            ]} />

            <div>
                <Text>Compact: <Code>true</Code></Text>
                <Text>Height: <Code>64px</Code></Text>
            </div>
            <Team h="64px" compact team={[ 
                { 
                    Character: agent, 
                    MindscapeLevel: 6,
                    Weapon: agent.Weapon!,
                    WeaponRefinement: 5,
                    DriveDiscSet: agent.DriveDisksSet[0].Set 
                },
                {
                    Speciality: "Support",
                    DriveDiscSet: agent.DriveDisksSet[1].Set
                }
            ]} />
        </Stack>}
    </Stack>
}

export default function KitchenSinkPage() {
    return (<>
        <Tabs defaultValue="main" variant="pills">
            <Tabs.List>
                <Tabs.Tab value="main">Application</Tabs.Tab>
                <Tabs.Tab value="profile">Profile</Tabs.Tab>
                <Tabs.Tab value="discs">Drive Discs</Tabs.Tab>
                <Tabs.Tab value="builds">Builds</Tabs.Tab>
            </Tabs.List>

            <Divider mt="lg" />

            <Tabs.Panel value="main"><ApplicationTab /></Tabs.Panel>
            <Tabs.Panel value="profile"><ProfileTab /></Tabs.Panel>
            <Tabs.Panel value="discs"><DiscsTab /></Tabs.Panel>
            <Tabs.Panel value="builds"><BuildsTab /></Tabs.Panel>
        </Tabs>
        
    </>)
}