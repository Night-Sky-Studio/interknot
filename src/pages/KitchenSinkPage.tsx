import { Stack, Loader, Tabs, Title, Text, Code, Divider, Flex, SegmentedControl, ScrollArea, Alert } from "@mantine/core"
import { useAsync } from "react-use"
import { useMemo, useState } from "react"
import { getBuildLeaderboards, getCharacters, getDriveDiscs, getLeaderboardUsers, getProfile } from "@/api/data"
import "@components/cells/styles/CritCell.css"
import "@components/cells/styles/WeaponCell.css"
import "./styles/TestPage.css"
import { UserHeader } from "@/components/UserHeader/UserHeader"
import { Team } from "@components/Team/Team.tsx"
import DriveDiscCard from "@/components/DriveDiscCard/DriveDiscCard"
// import MembershipCard from "@/components/MembershipCard/MembershipCard"
import { DriveDisc } from "@/components/DriveDisc/DriveDisc"
import DamageBar from "@/components/DamageBar/DamageBar"
import DamageDistribution from "@/components/DamageDistribution/DamageDistribution"
import type { ActionGroup, AgentAction } from "@interknot/types"
// import CharacterCard from "@/components/CharacterCard/CharacterCard";
// import CharacterCardContainer from "@/components/CharacterCard/CharacterCardContainer";
// import { SettingsProvider } from "@/components/SettingsProvider";
// import CardSettingsProvider from "@/components/CardSettingsProvider";
// import { DataProvider } from "@/components/DataProvider";
// import BuildActions from "@/components/BuildActions"
// import { DataProvider } from "@/components/DataProvider"
// import { ICardContext } from "@/components/CharacterCard/CharacterCard"

const uid = 1500438496

function ApplicationTab() {
    return <Stack p="md">
        <Title>Application</Title>

        {/* <MembershipCard /> */}
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
    const discsState = useAsync(async () => await getDriveDiscs({ uid, limit: 4, filter: {
        "set_id": "34100"
    } as Record<string, string> }), [uid])
    const discs = useMemo(() => discsState.value?.data, [discsState.value?.data])

    return <Stack p="md">
        <Title>Drive Discs</Title>

        { discsState.loading && <Loader /> }
        { discs && <>
                <Title order={2}>Drive Disc Card</Title>
                <Flex gap="md" wrap="wrap" w="calc(100% + 48px)">
                    { 
                        discs.map(dd => <DriveDiscCard key={dd.Uid} disc={dd} />)
                    }
                </Flex>

                <Title order={2}>Drive Disc Slot</Title>
                <Flex gap="md" wrap="wrap" w="calc(100% + 48px)">
                    { 
                        discs.map(dd => <DriveDisc key={dd.Uid} slot={dd.Slot} disc={dd} />)
                    }
                </Flex>
            </>
        }
           
    </Stack>
}

function BuildsTab() {
    // const profileState = useAsync(async () => getProfile(uid), [])
    // const profile = useMemo(() => profileState.value?.data, [profileState.value?.data])
    const buildsState = useAsync(async () => getCharacters({ uid }), [])
    const builds = useMemo(() => buildsState.value?.data, [buildsState.value?.data])
    const agent = useMemo(() => builds?.[0]?.Character, [builds])

    return <Stack p="md">
        <Title>Builds</Title>
        { buildsState.loading && <Loader /> }
        { builds && agent && <Stack>
            <Title order={2}>Team</Title>
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

            {/* <Title order={2}>Character Card</Title>
            <DataProvider data={{
                owner: profile,
                build: agent
            }}>
                <CardSettingsProvider>
                    <CharacterCard build={builds[0]} uid={uid} username="USERNAME" />
                </CardSettingsProvider>
            </DataProvider> */}
        </Stack>}
    </Stack>
}

// Only these leaderboards have action groups so far
const groupedLeaderboards = ["14310100", "14310101", "14310102", "14310103"]

function DamageBarCase({ title, description, actions, groups }: {
    title: string, description: string, actions: AgentAction[], groups: ActionGroup[]
}) {
    const [highlight, setHighlight] = useState({ idx: -1, groupIdx: -1 })
    return <Stack gap="xs">
        <Title order={3}>{title}</Title>
        <Text c="dimmed">{description}</Text>
        <Text fz="sm">Highlighted action index: <Code>{highlight.idx}</Code>, group start: <Code>{highlight.groupIdx}</Code></Text>
        <ScrollArea type="auto" offsetScrollbars>
            <DamageBar actions={actions} groups={groups} onHighlight={(idx, groupIdx) => setHighlight({ idx, groupIdx })} />
        </ScrollArea>
    </Stack>
}

function DamageDistributionCase({ buildId, leaderboardId }: { buildId: number, leaderboardId: number }) {
    // Loaded the same way BuildInfo gets its entries (LeaderboardProvider)
    const state = useAsync(async () => getBuildLeaderboards(buildId), [buildId])
    const entries = useMemo(() => state.value?.data?.Entries, [state.value?.data])

    return <Stack gap="xs">
        <Title order={3}>Damage Distribution</Title>
        <Text c="dimmed">
            The real component, with the main agent's actions only. Hover a Combo to outline its chips in gray;
            hover an action (in the bar, the Combo popover, or a chip) to outline its chip in the tag colour.
            Hovering a chip marks its bar segment without opening a popover.
        </Text>
        { state.loading && <Loader /> }
        { state.error && <Alert color="red" title="Failed to load build leaderboards">{state.error.message}</Alert> }
        { entries && <DamageDistribution key={leaderboardId} entries={entries} initialLeaderboardId={leaderboardId} /> }
    </Stack>
}

function DamageBarTab() {
    const [leaderboardId, setLeaderboardId] = useState(groupedLeaderboards[0])
    const entryState = useAsync(async () => getLeaderboardUsers(Number(leaderboardId), { limit: 1 }), [leaderboardId])
    const entry = useMemo(() => entryState.value?.data?.[0], [entryState.value?.data])
    // Zero-damage filter only; DamageDistribution additionally keeps just the main agent's actions
    const actions = useMemo(() => entry?.RotationValue.filter(a => a.Damage !== 0) ?? [], [entry])
    const groups = useMemo(() => entry?.Groups ?? [], [entry])

    const edgeCases = useMemo(() => {
        if (groups.length < 2) return undefined
        const [first, second] = groups
        const firstIdx = actions.findIndex(a => a.Id === first.ActionIds[0])
        return {
            // first group with an action from before it: no longer contiguous
            nonContiguous: [{ ...first, ActionIds: [...first.ActionIds, actions[Math.max(0, firstIdx - 2)].Id] }, second],
            // one group that doesn't resolve at all, one that's missing half its actions
            missingIds: [
                { ...first, ActionIds: ["00000000-0000-0000-0000-000000000000"] },
                { ...second, ActionIds: second.ActionIds.slice(0, Math.ceil(second.ActionIds.length / 2)) }
            ],
            // second group claims the first group's actions too
            overlapping: [first, { ...second, ActionIds: [...first.ActionIds, ...second.ActionIds] }]
        }
    }, [actions, groups])

    return <Stack p="md">
        <Title>Damage Bar</Title>
        <Text>Loads the top entry of a leaderboard from the local backend.</Text>
        <SegmentedControl data={groupedLeaderboards} value={leaderboardId} onChange={setLeaderboardId} w="fit-content" />

        { entryState.loading && <Loader /> }
        { entryState.error && <Alert color="red" title="Failed to load entry">{entryState.error.message}</Alert> }
        { entry && <>
            <Text>
                {actions.length} actions, {groups.length} groups
                ({groups.map(g => g.ActionIds.length).join(", ")} actions each)
            </Text>

            <DamageBarCase title="Grouped" actions={actions} groups={groups}
                description="Hover a Combo to see its actions; move into the popover to inspect them. It should stay open while crossing the gap, close as soon as the pointer leaves both." />

            <DamageDistributionCase buildId={entry.Build.Id} leaderboardId={Number(leaderboardId)} />

            <DamageBarCase title="Ungrouped" actions={actions} groups={[]}
                description="Same rotation without groups, for width comparison." />

            { edgeCases && <>
                <Divider label="Edge cases" />
                <DamageBarCase title="Non-contiguous group" actions={actions} groups={edgeCases.nonContiguous}
                    description="The first group also claims an action from before it. It should be left ungrouped; the second group still collapses." />
                <DamageBarCase title="Missing action IDs" actions={actions} groups={edgeCases.missingIds}
                    description="The first group references an unknown ID and should be skipped; the second only keeps its first half." />
                <DamageBarCase title="Overlapping groups" actions={actions} groups={edgeCases.overlapping}
                    description="The second group also claims the first group's actions. Only the first group should collapse." />
            </>}
        </>}
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
                <Tabs.Tab value="damage-bar">Damage Bar</Tabs.Tab>
            </Tabs.List>

            <Divider mt="lg" />

            <Tabs.Panel value="main"><ApplicationTab /></Tabs.Panel>
            <Tabs.Panel value="profile"><ProfileTab /></Tabs.Panel>
            <Tabs.Panel value="discs"><DiscsTab /></Tabs.Panel>
            <Tabs.Panel value="builds"><BuildsTab /></Tabs.Panel>
            <Tabs.Panel value="damage-bar"><DamageBarTab /></Tabs.Panel>
        </Tabs>
        
    </>)
}