import { BackgroundImage, Card, Group, Image, Stack, Title, Text, Paper, ColorSwatch, Portal, useMantineTheme, Space } from "@mantine/core"
import { RadarChart } from "@mantine/charts"
import { Character } from "@interknot/types"
import "./CharacterCard.css"
import { ProfessionIcon, ZenlessIcon, getRarityIcon } from "@icons/Icons"
import * as Mindscapes from "@icons/mindscapes"
import { Weapon, Property } from "@interknot/types"
import React, { memo, useMemo, useRef } from "react"
import type { DriveDiscSet, LeaderboardList, LeaderboardEntry } from "@interknot/types"
import { useSettings } from "@components/SettingsProvider"
import { DriveDisc } from "@components/DriveDisc/DriveDisc"
import { SubStat } from "@components/SubStat/SubStat"
import { useAsync } from "react-use"
import { getLeaderboardDmgDistribution } from "@api/data"
import { getShortPropertyName } from "@localization"
import { useWindowScroll } from "@mantine/hooks"
import { Team } from "@components/Team/Team"
import { toFixedCeil } from "@extensions/NumberExtensions"
import { useData } from "@components/DataProvider"
import { useLeaderboards } from "../LeaderboardProvider"
import { useCardSettings } from "../CardSettingsProvider"
import CoreSkill from "@components/CoreSkill/CoreSkill"
import Talents from "@components/Talents/Talents"

export interface TooltipData {
    charId: number,
    charName: string,
    uid: number,
    weaponId?: number
}

function MindscapeIcons({ level, size }: { level: number, size?: number }): React.ReactElement {
    size = size || 16
    const isActive = (lvl: number): string => (lvl <= level) ? "#fdf003" : "#4A4A4A"

    const { language } = useSettings()
    const { charId } = useData<TooltipData>()

    return (
        <Group gap="4px" h="100%" wrap="nowrap">
            <Mindscapes.Ms1 width={size} height={size} color={isActive(1)}
                data-zzz-lang={language} data-zzz-type="constellation" 
                data-zzz-id={charId} data-zzz-index={1} />
            <Mindscapes.Ms2 width={size} height={size} color={isActive(2)}
                data-zzz-lang={language} data-zzz-type="constellation" 
                data-zzz-id={charId} data-zzz-index={2} />
            <Mindscapes.Ms3 width={size} height={size} color={isActive(3)}
                data-zzz-lang={language} data-zzz-type="constellation" 
                data-zzz-id={charId} data-zzz-index={3} />
            <Mindscapes.Ms4 width={size} height={size} color={isActive(4)}
                data-zzz-lang={language} data-zzz-type="constellation" 
                data-zzz-id={charId} data-zzz-index={4} />
            <Mindscapes.Ms5 width={size} height={size} color={isActive(5)}
                data-zzz-lang={language} data-zzz-type="constellation" 
                data-zzz-id={charId} data-zzz-index={5} />
            <Mindscapes.Ms6 width={size} height={size} color={isActive(6)}
                data-zzz-lang={language} data-zzz-type="constellation" 
                data-zzz-id={charId} data-zzz-index={6} />
        </Group>
    )
}

function CharacterLevel({ level, msLevel }: { level: number, msLevel: number }): React.ReactElement {
    const { getLevel } = useSettings()
    return (
        <Group gap="0" h="28px" align="center" wrap="nowrap">
            <div className="cc-level" style={{ display: "flex", alignItems: "center" }}>
                <Title order={6} fz="16px">{getLevel(level)}</Title>
            </div>
            <div className="cc-mindscape">
                <MindscapeIcons size={20} level={msLevel} />
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
                <Title order={1} fz="36px" className="cc-character-name">{getLocalString(name)}</Title>
                <ZenlessIcon elementName={element} size={28} />
                <ProfessionIcon name={profession} size={28} />
            </Group>
            <CharacterLevel level={level} msLevel={msLevel}/>
        </Stack>
    )
}

export interface ICharacterCardProps {
    ref?: React.Ref<HTMLDivElement>
    uid: number
    username: string
    character: Character
}

function WeaponEngine({ weapon }: { weapon: Weapon }): React.ReactElement {
    const WeaponStat = ({ stat }: { stat: Property }) => {
        return (
            <Group gap="8px" className="cc-weapon-stat" wrap="nowrap">
                <ZenlessIcon id={stat.Id} size={20} />
                <Title order={6} fz="14px">{stat.formatted}</Title>
            </Group>
        )
    }

    const { language, getLocalString, getLevel } = useSettings()

    return (
        <div className="cc-weapon">
            <Group gap="12px" wrap="nowrap">
                <div className="cc-weapon-icon">
                    <Image src={weapon.ImageUrl} p="4px"
                        data-zzz-type="weapon" data-zzz-lang={language}
                        data-zzz-id={weapon.Id} data-zzz-level={weapon.Level} 
                        data-zzz-promote={weapon.BreakLevel} data-zzz-index={weapon.UpgradeLevel} />
                    <Image src={getRarityIcon(weapon.Rarity ?? 0)} alt={weapon.Rarity.toString()} />
                </div>
                <Stack gap="8px" justify="center"> 
                    <Title order={6} fz="20px">{getLocalString(weapon.Name)}</Title>
                    <Group gap="24px" align="flex-end" wrap="nowrap">
                        <Group gap="8px" wrap="nowrap">
                            <WeaponStat stat={weapon.MainStat} />
                            <WeaponStat stat={weapon.SecondaryStat} />
                        </Group>
                        <Group gap="8px" wrap="nowrap">
                            <div className="cc-weapon-stat level">
                                <Title order={6} fz="12px">{getLevel(weapon.Level)}</Title>
                            </div>
                            <div className="cc-weapon-stat level">
                                <Title order={6} fz="12px">P{weapon.UpgradeLevel}</Title>
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
        <div className="cc-stat" data-id={stat.Id}>
            <ZenlessIcon id={stat.Id} size={20} />
            <Title order={6} ml="4px" className={(highlight ? "cc-stat-name cc-highlight" : "cc-stat-name")}>{getLocalString(stat.simpleName)}</Title>
            <Title order={6} className={(highlight ? "cc-highlight" : "")}>{stat.formatted}</Title>
        </div>
    )
}

function DriveDiscSet({ set }: { set: DriveDiscSet }): React.ReactElement {
    const { language, getLocalString } = useSettings()
    return (
        <div className="cc-disc-set" data-zzz-type="artifact" data-zzz-lang={language} data-zzz-level={set.Count} data-zzz-id={set.Set.Id}>
            <Image h="28px" src={set.Set.IconUrl} alt={set.Set.Name} />
            <Title order={6} fz="14px">{getLocalString(set.Set.Name)}</Title>
            <Title order={6} fz="14px">x{set.Count}</Title>
        </div>
    )
}

interface IStatsGraphProps {
    leaderboard: LeaderboardList
    entry: Omit<LeaderboardEntry, "Build" | "RotationValue" | "Leaderboard">
    color: string
}

function StatsGraph({ leaderboard, entry, color }: IStatsGraphProps): React.ReactElement {
    const { getLocalString, decimalPlaces } = useSettings()
    const { context } = useCardSettings()
    const { showRanking } = context ?? {}

    const graphState = useAsync(async () => {
        return await getLeaderboardDmgDistribution(leaderboard.Id)
    }, [leaderboard.Id])

    const graph = useMemo(() => graphState.value?.data, [graphState.value])

    // useEffect(() => {
    //     console.log(graphState.loading, graphState.error, graphState.value)
    // }, [graphState.loading, graphState.error, graphState.value])

    const top1stats = useMemo(() => graph?.Top1AvgStats.filter(v => v.Value > 0.1), [graph?.Top1AvgStats])

    const stats = useMemo(() => entry.FinalStats.BaseStats, [entry.FinalStats.BaseStats])

    const filteredStats = useMemo(() => {
        return stats.filter(s => s.Value > 0.1)
    }, [stats])

    // if stat in top1stats is not present in filteredStats, remove it
    const filteredTop1Stats = useMemo(() => {
        return top1stats?.filter(s => filteredStats.some(fs => fs.Id === s.Id)) ?? []
    }, [top1stats, filteredStats])

    const relativeStats = useMemo(() => {
        // assume top1stats are 100%
        // then calculate stats relative to top1stats

        const result: Property[] = []
        for (const stat of filteredStats) {
            (stat.simpleName.includes("Sp") && console.log(stat))
            const top1Stat = filteredTop1Stats?.find(s => s.Id === stat.Id)
            if (top1Stat) {
                const relativeStat = new Property(stat.Id, stat.Name, Math.min((stat.Value / top1Stat.Value), 1.3))
                result.push(relativeStat)
            }
        }
        return result
    }, [filteredTop1Stats, filteredStats])


    // stats to show:
    // hp, atk, def, cr, cd, impact, elementalDmg,

    const radarRef = useRef<HTMLDivElement | null>(null)
    const theme = useMantineTheme()
    const [scroll, _] = useWindowScroll()
    const { language } = useSettings()

    return (
        <div className="cc-stats-graph" ref={radarRef} style={{
            marginTop: leaderboard.Character.Id === 1381 ? "80px" : undefined,
        }}>
            {top1stats &&
                <Stack gap="0px">
                    <RadarChart h={leaderboard.Character.Id === 1381 ? 260 : 280} w={300}
                        data={filteredTop1Stats.map(prop => {
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
                        gridColor={`${theme.colors.dark[4]}`}
                        polarGridProps={{
                            strokeWidth: 2
                        }}
                        withDots
                        radarProps={{
                            strokeWidth: 2,
                        }}
                        dotProps={{
                            r: 4
                        }}
                        withTooltip
                        withPolarRadiusAxis
                        polarRadiusAxisProps={{
                            domain: [0, "dataMax"],
                            tick: { display: "none" },
                            axisLine: { display: "none" },
                            scale: "auto",
                        }}
                        tooltipProps={{
                            content: ({ label, payload, coordinate, active }) => {
                                if (!payload) return null

                                const radarRect = radarRef?.current?.getBoundingClientRect()
                                if (!radarRect) return null
                                if (!coordinate || !coordinate.x || !coordinate.y) return null

                                // console.log(radarRect)
                                const x = radarRect.left + scroll.x + coordinate.x
                                const y = radarRect.top + scroll.y + coordinate.y

                                return (
                                    <Portal reuseTargetNode>
                                        {active && 
                                            <Paper px="md" py="sm" withBorder shadow="md" radius="sm" style={{ 
                                                position: "absolute",
                                                left: x,
                                                top: y,
                                                zIndex: 1000,
                                                userSelect: "none",
                                                backgroundColor: `color-mix(in srgb-linear, ${theme.colors.dark[7]} 100%, transparent 7.5%)`,
                                            }}>
                                                <Text fw={500} mb={5} fz="sm" ff="zzz, sans-serif">
                                                    {getLocalString(payload[0]?.payload?.prop?.simpleName ?? label)}
                                                </Text>
                                                <Stack gap="4px">
                                                {payload.map((item: any, idx: number) => {
                                                    let topOrCurrent = idx === 0 ? "Top 1%" : "Current"
                                                    let topOrCurrentValue = idx === 0 ? item?.payload?.prop?.formatted : item?.payload?.currentProp?.formatted
                                                    return <Group key={item.name} justify="space-between" wrap="nowrap">
                                                        <Group wrap="nowrap">
                                                            <ColorSwatch color={item.color} size={16} />
                                                            <Text fz="sm">
                                                                {topOrCurrent}
                                                            </Text>
                                                        </Group>
                                                        <Text fz="sm">
                                                            {topOrCurrentValue}
                                                        </Text>
                                                    </Group>
                                                })}
                                                </Stack>
                                            </Paper>
                                        }
                                    </Portal>
                                )
                            },
                            allowEscapeViewBox: { x: true, y: true },
                        }}
                        dataKey="name"
                        series={[
                            { name: "top1", color: `${theme.colors.dark[2]}`, opacity: 0.1 },
                            { name: "value", color: color, opacity: 0.25 }
                        ]} />
                    <Stack gap="8px" mt="-8px" align="center">
                        <Group gap="4px">
                            <div className="cc-graph-lb">
                                Top {toFixedCeil(entry.Rank / leaderboard.Total * 100, decimalPlaces)}%
                            </div>
                            <Group className="cc-graph-lb" gap="4px">
                                <Image h="22px" src={leaderboard.Weapon.ImageUrl}
                                    data-zzz-type="weapon" data-zzz-lang={language} 
                                    data-zzz-id={leaderboard.Weapon.Id}
                                    data-zzz-level={60} data-zzz-promote={5} />
                                <Title order={6} m="0" fz="14px">{leaderboard.Name}</Title>
                            </Group>
                        </Group>
                        <Team h="64px" team={[leaderboard.Character, ...leaderboard.Team]} />
                        {showRanking 
                            ? <div className="cc-graph-lb">
                                {entry.Rank} / {leaderboard.Total}
                            </div>
                            : <Space h="18px" />
                        }
                    </Stack>
                </Stack>
            }   
        </div>
    )
}

export default function CharacterCard({ ref, uid, username, character }: ICharacterCardProps): React.ReactElement {
    const { context } = useCardSettings()
    const { 
        showSubstatsBreakdown,
        showUserInfo,
        showGraph,
        showCritValue,
        selectedLeaderboardId
    } = context ?? {}
    
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

    const { entries, leaderboards, highlightId } = useLeaderboards()

    const leaderboard = useMemo(() => leaderboards.find(lb => lb.Id === (selectedLeaderboardId ?? highlightId)), [leaderboards, selectedLeaderboardId, highlightId])
    const entry = useMemo(() => entries.find(e => e.Leaderboard.Id === leaderboard?.Id), [entries, leaderboard?.Id])

    return (
        <Card className="character-card" ref={ref} withBorder shadow="xs" m="xs" p="0px"
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
                    <Stack gap="12px">
                        <CoreSkill level={character.SkillLevels.CoreSkill} />
                        <Talents talentLevels={character.SkillLevels} mindscapeLevel={character.MindscapeLevel}
                            isRupture={character.ProfessionType === "Rupture"} />
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
                                return <DriveDisc key={disc ? `disc-${disc.Uid}` : `disc-${character.Id * idx}`} 
                                    slot={disc ? disc.Slot : idx} disc={disc ?? null} />
                            })
                        }
                    </div>
                </div>
                <div className="cc-user">
                    {showUserInfo &&
                        <Stack gap="0px" className="cc-info-user">
                            <Text fz="14px">{uid}</Text>
                            <Text fz="20px" fw={600} mt="-2px">{username}</Text>
                        </Stack>
                    }
                    {showCritValue && 
                        <Title className="cc-cv" fz="18px" mt="-4px" component="span">
                            CV {character.CritValue}
                        </Title>
                    }
                </div>
                {showGraph &&
                    <div className="cc-leaderboard">
                        {leaderboard && entry &&
                            <StatsGraph leaderboard={leaderboard} entry={entry} color={character.Colors.Mindscape} />
                        }
                    </div>
                }
            </Card.Section>
            {showSubstatsBreakdown === true &&
                <Card.Section m="0px" className="cc-sub-stats">
                    {
                        collectSubstats.map(([cnt, ss]) => <Group gap="2px" wrap="nowrap" 
                            data-count={"*".repeat(cnt + 1)} key={ss.Id}>
                            <Text fz="16px">{cnt}</Text>
                            <SubStat stat={ss} />
                        </Group>)
                    }
                </Card.Section>
            }
        </Card>
    )
}

export const CharacterCardMemoized = memo(CharacterCard)