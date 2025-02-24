import { BackgroundImage, Card, Group, Image, SimpleGrid, Stack, Title } from "@mantine/core"
import { Character } from "../../backend/data/types/Character"
import "./styles/CharacterCard.css"
import { ProfessionIcon, ZenlessIcon, getDriveDiscGradient, getRarityIcon } from "./icons/Icons"
import * as Mindscapes from "./icons/mindscapes"
import * as TalentIcons from "./icons/talents"
import * as CoreSkillIcons from "./icons/core"
import { Weapon } from "../../backend/data/types/Weapon"
import { Property } from "../../backend/data/types/Property"
import React from "react"
import { DriveDisk } from "../../backend/data/types/DriveDisk"

function MindscapeIcons({ level, size }: { level: number, size?: number }): React.ReactElement {
    size = size || 16;
    const isActive = (lvl: number): string => (lvl <= level) ? "#fdf003" : "#4A4A4A";
    return (
        <Group gap="4px" h="100%">
            <Mindscapes.Ms1 width={size} height={size} color={isActive(1)} />
            <Mindscapes.Ms2 width={size} height={size} color={isActive(2)} />
            <Mindscapes.Ms3 width={size} height={size} color={isActive(3)} />
            <Mindscapes.Ms3 width={size} height={size} color={isActive(4)} />
            <Mindscapes.Ms4 width={size} height={size} color={isActive(5)} />
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
                <Title order={3}>{name}</Title>
                <ZenlessIcon elementName={element} size={16} />
                <ProfessionIcon name={profession} />
            </Group>
            <CharacterLevel level={level} msLevel={msLevel}/>
        </Stack>
    )
}

interface ICharacterCardProps {
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
                        <Title order={6} fz="11px">{weapon.Name}</Title>
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
            <Title order={6} fz="9px" ml="4px">{stat.simpleNameLocalized}</Title>
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

function Talents({ talentLevels }: { talentLevels: number[] }): React.ReactElement {
    return (
        <Group className="cc-talents" gap="4px" justify="center" align="center">
            <div className="cc-talent">
                <TalentIcons.NormalAtk width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels[0]}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Dodge width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels[1]}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Switch width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels[2]}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Skill width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels[3]}</Title>
            </div>
            <div className="cc-talent">
                <TalentIcons.Ultimate width="32px" />
                <Title fz="6px" order={6} className="cc-talent-level">{talentLevels[4]}</Title>
            </div>
        </Group>
    )
}

function DriveDisc({ disc }: { disc: DriveDisk }) {
    return (
        <div className="cc-disc" style={{ "--disc-gradient": getDriveDiscGradient(disc.SetId) } as React.CSSProperties}>
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
        </div>
    )
}

export default function CharacterCard({ uid, username, character }: ICharacterCardProps): React.ReactElement {
    return (
        <Card className="character-card" withBorder shadow="xs" m="lg" p="0px"
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
                        character.BaseStats.map(s => <Stat key={s.Id ^ character.Id} stat={s} />)
                    }
                </div>

                <div className="cc-cell cc-skills">
                    <Stack gap="6px">
                        <CoreSkill level={character.CoreSkillEnhancement} />
                        <Talents talentLevels={character.SkillLevels} />
                    </Stack>
                </div>

                <div className="cc-discs">
                    {
                        character.DriveDisks.map(d => <DriveDisc key={d.Uid} disc={d} />)
                    }
                </div>
            </div>
        </Card>
    )
}