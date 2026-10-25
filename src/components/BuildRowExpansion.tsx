import { Property, type Build } from "@interknot/types"
import { ActionIcon, Group, Popover, Space, Stack, Title, Text, Tooltip } from "@mantine/core"
import { IconQuestionMark } from "@tabler/icons-react"
import CardFooter from "./CardFooter/CardFooter"
import PropertyCell from "./cells/PropertyCell"
import { ICardContext } from "./CharacterCard/CharacterCard"
import CoreSkill from "./CoreSkill/CoreSkill"
import { DataProvider } from "./DataProvider"
import LeaderboardProvider from "./LeaderboardProvider"
import Talents from "./Talents/Talents"
import { DriveDisc } from "./DriveDisc/DriveDisc"
import { useSettings } from "./SettingsProvider";

export interface IBuildRowExpansionProps {
    build: Build
    finalStats?: Property[]
}

export default function BuildRowExpansion({ build, finalStats }: IBuildRowExpansionProps): React.ReactElement {
    const characterAccentColor = () => {
        switch (build.Character.Id) {
            // case 1461: return character.Colors.Accent // Seed
            // case 1501: return build.Character.Colors.AccentExtra // Aria
            default: return build.Character.Colors.Mindscape
        }
    }

    const { getLocalString } = useSettings()

    return <LeaderboardProvider
        buildId={build.Id}
        characterId={build.Character.Id}>
        <DataProvider data={{
            owner: build.Owner!,
            build: build
        } satisfies ICardContext}>
            <Stack gap="xs" m="md" w="100%" style={{ 
                "--accent": characterAccentColor(),
                "--mindscape": build.Character.Colors.Accent
            }}>
                <Title order={4}>Talents</Title>
                <Group>
                    <CoreSkill level={build.Character.SkillLevels.CoreSkill} />
                    <Talents 
                        profession={build.Character.ProfessionType}
                        talentLevels={build.Character.SkillLevels}
                        mindscapeLevel={build.Character.MindscapeLevel} />
                </Group>

                <Title order={4}>Drive Discs</Title>
                <Group w="100%" justify="space-evenly" gap="xs">
                    {
                        Array.from({ length: 6 }, (_, i) => i + 1).map(idx => {
                            const disc = build.Character.DriveDisks.find(dd => dd.Slot === idx)
                            return <DriveDisc key={disc ? `disc-${disc.Uid}` : `disc-${build.Character.Id * idx}`} 
                                slot={disc ? disc.Slot : idx} disc={disc ?? null} highlightProps={build.Character.Highlights.SubStats} />
                        })
                    }
                </Group>

                <Space h="md" />

                { finalStats && <>

                    <Group gap="xs" align="center">
                        <Title order={4}>Final calculated stats</Title>
                        <Popover position="right" width="512px" withArrow withOverlay>
                            <Popover.Dropdown>
                                <Text>
                                    These are the final stats before any damage calculations take place. 
                                    They include all possible passives and bonuses as well as resistance shreds (such as weapon, drive disc set 4pc, and character passives) - either partially or with full uptime. 
                                    For more details, check out the calculator 
                                    <Text component="a" href="https://github.com/Night-Sky-Studio/interknot-calculator/wiki" target="_blank" c="blue"> wiki page.</Text>
                                </Text>
                            </Popover.Dropdown>
                            <Popover.Target>
                                <ActionIcon h="0.5rem" w="0.5rem" variant="light">
                                    <IconQuestionMark size="1rem" />
                                </ActionIcon>
                            </Popover.Target>
                        </Popover>
                    </Group>
                
                    <Group gap="xs">
                        { finalStats.filter(ss => ss.Value != 0).map(stat => {
                            return (
                                <Tooltip label={getLocalString(stat.simpleName)} key={stat.Id} portalProps={{ reuseTargetNode: true }}>
                                    <PropertyCell className="final-stat" prop={stat} />
                                </Tooltip>
                            )
                        }) }
                    </Group>

                    <Space h="md" />
                </>}

                <CardFooter />
            </Stack>
        </DataProvider> 
    </LeaderboardProvider>
}