import { BackgroundImage, Card, Grid, Group, Image, Stack, Title } from "@mantine/core"
import { Character } from "../../backend/data/types/Character"
import "./styles/CharacterCard.css"
import { ProfessionIcon, ZenlessIcon, getRarityIcon } from "./icons/Icons"
import * as Mindscapes from "./icons/mindscapes"
import { Weapon } from "../../backend/data/types/Weapon"
import { ValueProperty } from "../../backend/data/types/Property"
import { useEffect, useState } from "react"

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
        <Stack className="cc-name" gap="0">
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
    const WeaponStat = ({ stat }: { stat: ValueProperty }) => {
        return (
            <Group gap="6px" className="cc-weapon-stat">
                <ZenlessIcon id={stat.Id} size={12} />
                <Title order={6} fz="9px">{ValueProperty.format(stat.Format, stat.Value, true)}</Title>
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

export default function CharacterCard({ uid, username, character }: ICharacterCardProps): React.ReactElement {
    return (
        <Card className="character-card" withBorder shadow="xs" m="lg" p="0px"
            style={{ "--accent": character.Colors.Mindscape }}>
            <div className="cc-grid">
                <div className="cc-image">
                    <BackgroundImage mt="xs" className="character-img" src={character.ImageUrl} />
                </div>
                <div className="cc-stats-bg" />
                <div className="cc-stats">
                    <Stack ml="xs" gap="0">
                        <Group gap="2px" wrap="nowrap">
                            <CharacterName name={character.Name} 
                                element={character.ElementTypes[0]} profession={character.ProfessionType}
                                level={character.Level} msLevel={character.MindscapeLevel} />
                            <WeaponEngine weapon={character.Weapon ?? undefined}/>
                        </Group>
                    </Stack>
                </div>
            </div>
        </Card>
    )
}