import { BackgroundImage, Card, Group, Image, SimpleGrid, Stack, Title, Text, useMantineTheme } from "@mantine/core"
import { Character, Talents as CharacterTalents } from "@interknot/types"
import "./styles/CharacterCard.css"
import { ProfessionIcon, ZenlessIcon, getDriveDiscGradient, getRarityIcon } from "./icons/Icons"
import * as Mindscapes from "./icons/mindscapes"
import * as TalentIcons from "./icons/talents"
import * as CoreSkillIcons from "./icons/core"
import { Weapon, Property } from "@interknot/types"
import React from "react"
import { type DriveDisc, DriveDiskSet } from "@interknot/types"
import { getLocalString } from "../localization/Localization"

function MindscapeIcons({ level, size }: { level: number, size?: number }): React.ReactElement {
    size = size || 16;
    const isActive = (lvl: number): string => (lvl <= level) ? "#fdf003" : "#4A4A4A";
    return (
        <Group gap="4px" h="100%">
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
        <Group gap="0" h="16px" align="center">
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
    return (
        <Stack gap="0">
            <Group gap="4px">
                <Title order={3}>{getLocalString(name)}</Title>
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
}

function WeaponEngine({ weapon }: { weapon?: Weapon }): React.ReactElement {
    const WeaponStat = ({ stat }: { stat: Property }) => {
        return (
            <Group gap="6px" className="cc-weapon-stat">
                <ZenlessIcon id={stat.Id} size={12} />
                <Title order={6} fz="9px">{stat.formatted}</Title>
            </Group>
        )
    }

    return (
        <div className="cc-weapon">
            <Group gap="8px">
                <div className="cc-weapon-icon">
                    <Image src={weapon?.ImageUrl} />
                    <Image src={getRarityIcon(weapon?.Rarity ?? 0)} alt={weapon?.Rarity.toString()} />
                </div>
                {weapon && 
                    <Stack gap="4px" justify="center"> 
                        <Title order={6} fz="11px">{getLocalString(weapon.Name)}</Title>
                        <Group gap="16px" align="flex-end">
                            <Group gap="4px">
                                <WeaponStat stat={weapon.MainStat} />
                                <WeaponStat stat={weapon.SecondaryStat} />
                            </Group>
                            <Group gap="4px">
                                <div className="cc-weapon-stat level">
                                    <Title order={6} fz="8px">Lv. {weapon.Level}</Title>
                                </div>
                                <div className="cc-weapon-stat level">
                                    <Title order={6} fz="8px">P{weapon.UpgradeLevel}</Title>
                                </div>
                            </Group>
                        </Group>
                    </Stack>
                }
            </Group>
        </div>
    )
}

function Stat({ stat }: { stat: Property }): React.ReactElement {
    return (
        <div className="cc-stat">
            <ZenlessIcon id={stat.Id} size={12} />
            <Title order={6} fz="9px" ml="4px">{getLocalString(stat.simpleName)}</Title>
            <Title order={6} fz="9px">{stat.formatted}</Title>
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

function Talents({ talentLevels }: { talentLevels: CharacterTalents }): React.ReactElement {
    return (
        <Group className="cc-talents" gap="4px" justify="center" align="center">
            <div className="cc-talent">
                <TalentIcons.NormalAtk width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels.BasicAttack}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Dodge width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels.Dash}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Switch width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels.Assist}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Skill width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels.SpecialAttack}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Ultimate width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels.Ultimate}</Title>
            </div>
        </Group>
    )
}

function SubStat({ stat }: { stat: Property }): React.ReactElement {
    const SubStatLevel = ({ level }: { level: number }) => {
        const isActive = (lvl: number) => lvl <= level
        return <SimpleGrid cols={4} spacing="2px" verticalSpacing="0"> 
            <div className="cc-disc-stat-level" data-active={isActive(2)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(3)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(4)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(5)}></div>
        </SimpleGrid>
    }

    return (
        <Stack className="cc-disc-stat" gap="1px">
            <Group align="flex-start" gap="4px">
                <ZenlessIcon id={stat.Id} size={12} />
                <Title order={6} fz="11px" mt="-2px" h="12px">{stat.formatted}</Title>
            </Group>
            <SubStatLevel level={stat.Level}/>
        </Stack>
    )
}

function DriveDisc({ disc }: { disc: DriveDisc }): React.ReactElement {
    const theme = useMantineTheme()

    const cvColor = (cv: number) => {
        switch(true) {
            case cv >= 28.8: return theme.colors.red[7]
            case cv >= 24: return theme.colors.pink[7]
            case cv >= 19.2: return theme.colors.grape[7]
            case cv >= 14.4: return theme.colors.violet[6]
            case cv >= 9.6: return theme.colors.blue[6]
            default: return undefined
        }
    }

    return (
        <div className="cc-disc" style={{ "--disc-gradient": getDriveDiscGradient(disc.SetId), "--cv": cvColor(disc.CritValue.Value / 100) } as React.CSSProperties}>
            <Group gap="4px" className="cc-disc-main" wrap="nowrap">
                <div className="cc-disc-icon">
                    <Image src={disc.IconUrl} alt={disc.Name} />
                    <Image src={getRarityIcon(disc.Rarity)} alt={disc.Rarity.toString()} />
                </div>
                <Stack gap="0px" justify="space-evenly" style={{ zIndex: "100" }}>
                    <Title order={6} fz="8px">Lv. {disc.Level}</Title>
                    <Group gap="2px" wrap="nowrap">
                        <ZenlessIcon id={disc.MainStat.Id} size="18px"/>
                        <Title order={6} fz="14px">{disc.MainStat.formatted}</Title>
                    </Group>
                    <Title order={6} fz="8px">CV {(disc.CritValue.Value / 100).toFixed(1)}</Title>
                </Stack>
            </Group>
            <SimpleGrid cols={2} spacing="4px" verticalSpacing="4px" className="cc-disc-stats">
                {
                    disc.SubStats.map(ss => <SubStat key={disc.Uid ^ ss.Id} stat={ss} />)
                }
            </SimpleGrid>
        </div>
    )
}

function DriveDiscSet({ set }: { set: DriveDiskSet }): React.ReactElement {
    return (
        <div className="cc-disc-set">
            <Image h="18px" src={set.Set.IconUrl} alt={set.Set.Name} />
            <Title order={6} fz="8px">{getLocalString(set.Set.Name)}</Title>
            <Title order={6} fz="8px">x{set.Count}</Title>
        </div>
    )
}

export default function CharacterCard({ ref, uid, username, character }: ICharacterCardProps): React.ReactElement {
    return (
        <Card className="character-card" ref={ref} withBorder shadow="xs" m="lg" p="0px"
            style={{ "--accent": character.Colors.Mindscape }}>
            <div className="cc-grid">
                <div className="cc-image">
                    <BackgroundImage mt="xs" className="character-img" src={character.ImageUrl} />
                </div>
                <div className="cc-info-bg" />
                <div className="cc-cell cc-info">
                    <Group gap="8px" wrap="nowrap">
                        <CharacterName name={character.Name} 
                            element={character.ElementTypes[0]} profession={character.ProfessionType}
                            level={character.Level} msLevel={character.MindscapeLevel} />
                        <WeaponEngine weapon={character.Weapon ?? undefined}/>
                    </Group>
                </div>
                <div className="cc-vignette" />
                <div className="cc-cell cc-stats">
                    {
                        character.Stats.map(s => <Stat key={s.Id ^ character.Id} stat={s} />)
                    }
                </div>
                <div className="cc-cell cc-skills">
                    <Stack gap="6px">
                        <CoreSkill level={character.CoreSkillEnhancement} />
                        <Talents talentLevels={character.SkillLevels} />
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
                            character.DriveDisks.map(d => <DriveDisc key={d.Uid} disc={d} />)
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
            </div>
        </Card>
    )
}