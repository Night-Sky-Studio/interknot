import { BackgroundImage, Card, Group, Image, Stack, Title, Text, Paper, ColorSwatch } from "@mantine/core"
import { RadarChart } from "@mantine/charts"
import { Character, Talents as CharacterTalents } from "@interknot/types"
import "./styles/CharacterCard.css"
import { ProfessionIcon, ZenlessIcon, getRarityIcon } from "./icons/Icons"
import * as Mindscapes from "./icons/mindscapes"
import * as TalentIcons from "./icons/talents"
import * as CoreSkillIcons from "./icons/core"
import { Weapon, Property } from "@interknot/types"
import React, { memo, useMemo } from "react"
import type { DriveDiscSet, LeaderboardAgent } from "@interknot/types"
import { useSettings } from "./SettingsProvider"
import { DriveDisc } from "./DriveDisc"
import { SubStat } from "./SubStat"
import { useAsync } from "react-use"
import { getLeaderboardDmgDistribution } from "../api/data"
import { getShortPropertyName } from "../localization/Localization"

function MindscapeIcons({ level, size }: { level: number, size?: number }): React.ReactElement {
    size = size || 16;
    const isActive = (lvl: number): string => (lvl <= level) ? "#fdf003" : "#4A4A4A";
    return (
        <Group gap="4px" h="100%" wrap="nowrap">
            <Mindscapes.Ms1 width={size} height={size} color={isActive(1)} />
            <Mindscapes.Ms2 width={size} height={size} color={isActive(2)} />
            <Mindscapes.Ms3 width={size} height={size} color={isActive(3)} />
            <Mindscapes.Ms4 width={size} height={size} color={isActive(4)} />
            <Mindscapes.Ms5 width={size} height={size} color={isActive(5)} />
            <Mindscapes.Ms6 width={size} height={size} color={isActive(6)} />
        </Group>
    )
}

function CharacterLevel({ level, msLevel }: { level: number, msLevel: number }): React.ReactElement {
    return (
        <Group gap="0" h="16px" align="center" wrap="nowrap">
            <div className="cc-level">
                <Title order={6} fz="10px">Lv. {level}</Title>
            </div>
            <div className="cc-mindscape">
                <MindscapeIcons size={12} level={msLevel} />
            </div>
        </Group>
    )
}

interface ICharacterNameProps {
    name: string
    element: string
    profession: string
    level: number
    msLevel: number
}

function CharacterName({ name, element, profession, level, msLevel }: ICharacterNameProps): React.ReactElement {
    const { getLocalString } = useSettings()
    return (
        <Stack gap="0">
            <Group gap="4px" wrap="nowrap">
                <Title order={3} className="cc-character-name">{getLocalString(name)}</Title>
                <ZenlessIcon elementName={element} size={16} />
                <ProfessionIcon name={profession} />
            </Group>
            <CharacterLevel level={level} msLevel={msLevel}/>
        </Stack>
    )
}

interface ICharacterCardProps {
    ref?: React.Ref<HTMLDivElement>
    uid: number
    username: string
    character: Character
    leaderboard?: LeaderboardAgent
    substatsVisible?: boolean
}

function WeaponEngine({ weapon }: { weapon: Weapon }): React.ReactElement {
    const WeaponStat = ({ stat }: { stat: Property }) => {
        return (
            <Group gap="6px" className="cc-weapon-stat" wrap="nowrap">
                <ZenlessIcon id={stat.Id} size={12} />
                <Title order={6} fz="9px">{stat.formatted}</Title>
            </Group>
        )
    }

    const { getLocalString } = useSettings()

    return (
        <div className="cc-weapon">
            <Group gap="8px" wrap="nowrap">
                <div className="cc-weapon-icon">
                    <Image src={weapon.ImageUrl} />
                    <Image src={getRarityIcon(weapon.Rarity ?? 0)} alt={weapon.Rarity.toString()} />
                </div>
                <Stack gap="4px" justify="center"> 
                    <Title order={6} fz="11px">{getLocalString(weapon.Name)}</Title>
                    <Group gap="16px" align="flex-end" wrap="nowrap">
                        <Group gap="4px" wrap="nowrap">
                            <WeaponStat stat={weapon.MainStat} />
                            <WeaponStat stat={weapon.SecondaryStat} />
                        </Group>
                        <Group gap="4px" wrap="nowrap">
                            <div className="cc-weapon-stat level">
                                <Title order={6} fz="8px">Lv. {weapon.Level}</Title>
                            </div>
                            <div className="cc-weapon-stat level">
                                <Title order={6} fz="8px">P{weapon.UpgradeLevel}</Title>
                            </div>
                        </Group>
                    </Group>
                </Stack>
            </Group>
        </div>
    )
}

function Stat({ stat, highlight }: { stat: Property, highlight?: boolean }): React.ReactElement {
    const { getLocalString } = useSettings()
    return (
        <div className="cc-stat">
            <ZenlessIcon id={stat.Id} size={12} />
            <Title order={6} ml="4px" className={(highlight ? "cc-highlight" : "")}>{getLocalString(stat.simpleName)}</Title>
            <Title order={6} className={(highlight ? "cc-highlight" : "")}>{stat.formatted}</Title>
        </div>
    )
}

function CoreSkill({ level }: { level: number }): React.ReactElement {
    const isActive = (lvl: number): string => (lvl <= level) ? "var(--accent)" : "var(--mantine-color-dark-9)"
    return (
        <Group className="cc-core" gap="0px" justify="space-between" wrap="nowrap">
            <div style={{ backgroundColor: isActive(1) }}><CoreSkillIcons.A fill="white" height="12px" /></div>
            <div style={{ backgroundColor: isActive(2) }}><CoreSkillIcons.B fill="white" height="12px" /></div>
            <div style={{ backgroundColor: isActive(3) }}><CoreSkillIcons.C fill="white" height="12px" /></div>
            <div style={{ backgroundColor: isActive(4) }}><CoreSkillIcons.D fill="white" height="12px" /></div>
            <div style={{ backgroundColor: isActive(5) }}><CoreSkillIcons.E fill="white" height="12px" /></div>
            <div style={{ backgroundColor: isActive(6) }}><CoreSkillIcons.F fill="white" height="12px" /></div>
        </Group>
    )
}

function Talents({ talentLevels, mindscapeLevel }: { talentLevels: CharacterTalents, mindscapeLevel: number }): React.ReactElement {
    // mindscapeLevel >= 5 ? 4 : mindscapeLevel >= 3 ? 2 : 0
    const mindscapeBoost = Math.floor(Math.min(mindscapeLevel, 6) / 2.5) * 2
    return (
        <Group className={`cc-talents ${mindscapeLevel > 2 ? "boosted" : ""}`} 
            gap="4px" justify="center" align="center" wrap="nowrap">
            <div className="cc-talent">
                <TalentIcons.NormalAtk width="32px" />
                <Title order={6} className="cc-talent-level">{talentLevels.BasicAttack + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Dodge width="32px" />
                <Title order={6} className="cc-talent-level">{talentLevels.Dash + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Switch width="32px" />
                <Title order={6} className="cc-talent-level">{talentLevels.Assist + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Skill width="32px" />
                <Title order={6} className="cc-talent-level">{talentLevels.SpecialAttack + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Ultimate width="32px" />
                <Title order={6} className="cc-talent-level">{talentLevels.Ultimate + mindscapeBoost}</Title>
            </div>
        </Group>
    )
}

function DriveDiscSet({ set }: { set: DriveDiscSet }): React.ReactElement {
    const { getLocalString } = useSettings()
    return (
        <div className="cc-disc-set">
            <Image h="18px" src={set.Set.IconUrl} alt={set.Set.Name} />
            <Title order={6} fz="8px">{getLocalString(set.Set.Name)}</Title>
            <Title order={6} fz="8px">x{set.Count}</Title>
        </div>
    )
}

function StatsGraph({ leaderboard, stats }: { leaderboard: LeaderboardAgent, stats: Property[] }): React.ReactElement {
    const { getLocalString } = useSettings()

    const graphState = useAsync(async () => {
        return await getLeaderboardDmgDistribution(leaderboard.LeaderboardId)
    })

    const top1stats = useMemo(() => graphState.value?.Top1AvgStats.filter(v => v.Value > 0), [graphState.value?.Top1AvgStats])

    const relativeStats = useMemo(() => {
        // assume top1stats are 100%
        // then calculate stats relative to top1stats

        const result: Property[] = []
        for (const stat of stats) {
            const top1Stat = top1stats?.find(s => s.Id === stat.Id)
            if (top1Stat) {
                const relativeStat = new Property(stat.Id, stat.Name, (stat.Value / top1Stat.Value))
                result.push(relativeStat)
            }
        }
        return result.filter(s => s.Value > 0)
    }, [top1stats, stats])


    // stats to show:
    // hp, atk, def, cr, cd, impact, elementalDmg,

    return (
        <div className="cc-stats-graph">
            {top1stats &&
                <RadarChart h={200} w={200}
                    data={top1stats.map(prop => {
                        let name = getLocalString(prop.simpleName)
                        if (name.length > 6) {
                            name = getShortPropertyName(prop.Id)
                        }
                        return {
                            name: name,
                            prop: prop,
                            currentProp: stats.find(s => s.Id === prop.Id),
                            value: relativeStats.find(s => s.Id === Number(prop.Id))?.Value ?? 0,
                            top1: 1
                        }
                    })}
                    textColor="white"
                    tooltipProps={{
                        content: ({ label, payload }) => {
                            if (!payload) return null

                            return (
                                <Paper px="md" py="sm" withBorder shadow="md" radius="sm" style={{ 
                                    transform: "scale(calc(1 / var(--scale) + 0.1))",
                                    transformOrigin: "top left",
                                }}>
                                    <Text fw={500} mb={5} fz="xs">
                                        {label}
                                    </Text>
                                    <Stack gap="4px">
                                    {payload.map((item: any, idx: number) => {
                                        let topOrCurrent = idx === 0 ? "Top 1%" : "Current"
                                        let topOrCurrentValue = idx === 0 ? item?.payload?.prop?.formatted : item?.payload?.currentProp?.formatted
                                        return <Group key={item.name}>
                                            <ColorSwatch color={item.color} size={16} />
                                            <Text fz="8px">
                                                {topOrCurrent}
                                            </Text>
                                            <Text fz="8px">
                                                {topOrCurrentValue}
                                            </Text>
                                        </Group>
                                    })}
                                    </Stack>
                                </Paper>
                            )
                        },
                        // labelStyle: {
                        //     color: "white",
                        //     fontSize: "12px",
                        // },
                        // position: { x: 100, y: 140 }
                        allowEscapeViewBox: { x: true, y: true },
                    }}
                    polarAngleAxisProps={{
                    }}
                    dataKey="name"
                    series={[
                        { name: "top1", color: "var(--mantine-color-dark-2)", opacity: 0.1 },
                        { name: "value", color: "var(--accent)", opacity: 0.25 }
                    ]} />
            }   
        </div>
    )
}

export default function CharacterCard({ ref, uid, username, character, leaderboard, substatsVisible }: ICharacterCardProps): React.ReactElement {
    const collectSubstats = useMemo((): [number, Property][] => {
        const result: [number, Property][] = []
        const substatValueMap: Record<number, number> = {}
        const substatNameMap: Record<number, string> = {}
        const substatCountMap: Record<number, number> = {}

        for (let disc of character.DriveDisks) {
            for (let subStat of disc.SubStats) {
                if (!substatValueMap[subStat.Id]) {
                    substatValueMap[subStat.Id] = subStat.Value
                    substatNameMap[subStat.Id] = subStat.Name
                    substatCountMap[subStat.Id] = subStat.Level
                } else {
                    substatValueMap[subStat.Id] += subStat.Value
                    substatCountMap[subStat.Id] += subStat.Level
                }
            }
        }

        for (const [sid, value] of Object.entries(substatValueMap)) {
            const id = Number(sid)
            result.push([substatCountMap[id], new Property(id, substatNameMap[id], value)])
        }
        return result
    }, [character.DriveDisks])

    return (<Stack>
        <Card className="character-card" ref={ref} withBorder shadow="xs" m="lg" p="0px"
            style={{ "--accent": character.Colors.Mindscape, "--mindscape": character.Colors.Accent, accentColor: character.Colors.Mindscape }}>
            <Card.Section m="0" className="cc-grid">
                <div className="cc-image">
                    <BackgroundImage mt="xs" className="character-img" src={character.ImageUrl} />
                </div>
                <div className="cc-info-bg" />
                <div className="cc-cell cc-info">
                    <Group gap="8px" wrap="nowrap">
                        <CharacterName name={character.Name} 
                            element={character.ElementTypes[0]} profession={character.ProfessionType}
                            level={character.Level} msLevel={character.MindscapeLevel} />
                        {character.Weapon && <WeaponEngine weapon={character.Weapon} /> }
                    </Group>
                </div>
                <div className="cc-vignette" />
                <div className="cc-cell cc-stats">
                    {
                        character.Stats.map(s => <Stat key={s.Id ^ character.Id} stat={s} highlight={character.HighlightProps?.includes(s.Id) ?? false} />)
                    }
                </div>
                <div className="cc-cell cc-skills">
                    <Stack gap="6px">
                        <CoreSkill level={character.CoreSkillEnhancement} />
                        <Talents talentLevels={character.SkillLevels} mindscapeLevel={character.MindscapeLevel} />
                    </Stack>
                    <Stack gap="4px" justify="flex-end">
                        {
                            character.DriveDisksSet.map(dds => <DriveDiscSet key={dds.Set.Id} set={dds} />)
                        }
                    </Stack>
                </div>
                <div className="cc-discs">
                    <div className="cc-discs-grid">
                        {
                            Array.from({ length: 6 }, (_, i) => i + 1).map(idx => {
                                const disc = character.DriveDisks.find(dd => dd.Slot === idx)
                                return <DriveDisc key={disc ? disc.Uid : character.Id ^ idx} 
                                    slot={disc ? disc.Slot : idx} disc={disc ?? null} />
                            })
                        }
                    </div>
                </div>
                <div className="cc-user">
                    <Stack gap="0px" className="cc-info-user">
                        <Text fz="8px">{uid}</Text>
                        <Text fz="12px" fw={600} mt="-2px">{username}</Text>
                    </Stack>
                    <Title className="cc-cv" fz="12px" mt="-4px" component="span">
                        CV {character.CritValue}
                    </Title>
                </div>
                <div className="cc-leaderboard">
                    {leaderboard &&
                        <StatsGraph leaderboard={leaderboard} stats={character.Stats} />
                    }
                </div>
            </Card.Section>
            {substatsVisible && substatsVisible === true &&
                <Card.Section m="0px" className="cc-sub-stats">
                    {
                        collectSubstats.map(([cnt, ss]) => <Group gap="2px" wrap="nowrap" 
                            data-count={"*".repeat(cnt + 1)} key={ss.Id}>
                            <Text fz="10px">{cnt}</Text>
                            <SubStat stat={ss} />
                        </Group>)
                    }
                </Card.Section>
            }
        </Card>
        
    </Stack>)
}

export const CharacterCardMemorized = memo(CharacterCard)