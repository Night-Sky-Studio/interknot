import { Character, LeaderboardAgent, Property } from "@interknot/types"
import { Card, Group, Table, Image, Text, Collapse, Stack, Button, Switch } from "@mantine/core"
import "./styles/CharactersTable.pcss"
import { CharacterCardMemorized } from "./CharacterCard"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { useDisclosure, useResizeObserver } from "@mantine/hooks"
import { IconChevronDown, IconChevronUp, IconDownload } from "@tabler/icons-react"
import { toPng } from "html-to-image"
import { useSettings } from "./SettingsProvider"
import { DamageDistributionMemoized } from "./DamageDistribution"
import { ExpandableRow } from "./ExpandableRow"
import CritCell from "./cells/CritCell"
import PropertyCell from "./cells/PropertyCell"

interface ICharactersTableProps {
    uid: number
    username: string
    characters: Character[]
    lbAgents?: LeaderboardAgent[],
    openedId?: number | null
}

export default function CharactersTable({ uid, username, characters, lbAgents, openedId }: ICharactersTableProps): React.ReactElement {
    const { getLocalString } = useSettings()

    // const [sortMode, setSortMode] = useState(0)

    // useEffect(() => {
    //     // Update tableData
    // }, [sortMode])

    const mindscapeChip = (level: number) => {
        return <div className="chip mindscape-chip" style={{ padding: `0.125rem ${(level / 5 + 1) * 1}rem` }} data-level={level}>
            <Text fw={700}>{level}</Text>
        </div>
    }

    const CharacterRow = ({ c, i, isOpened }: { c: Character, i: number, isOpened: boolean }) => {
        // const [openedId, setOpenedId] = useState<number | null>(null)
        const CARD_ASPECT_RATIO = 21 / 43
        const [cardScale, setCardScale] = useState(1)
        const [cardContainerHeight, setCardContainerHeight] = useState(860 * CARD_ASPECT_RATIO)
        const [cardContainerRef, cardContainerRect] = useResizeObserver()

        const [isCardVisible, { toggle }] = useDisclosure(isOpened)
        const [isSubstatsVisible, { toggle: toggleSubstats }] = useDisclosure(true)
        const [isDmgDistributionVisible, { toggle: toggleDmgDistribution }] = useDisclosure(false)

        useEffect(() => {
            if (cardContainerRect.width) {
                const newScale = Math.max(cardContainerRect.width / 900, 1)
                setCardScale(newScale)
                setCardContainerHeight(Math.round(cardContainerRect.width * CARD_ASPECT_RATIO) + 20 + (isSubstatsVisible ? 24 : 0))
            }
        }, [cardContainerRect.width, isSubstatsVisible])
        
        const cardRef = useRef<HTMLDivElement | null>(null)

        const agentLeaderboards = lbAgents?.filter(l => l.Agent.Id === c.Id) ?? []

        // Scroll card into view when opened
        /*
        useEffect(() => {
            if (isOpened && cardContainerRef.current) {
                setTimeout(() => {
                    cardContainerRef.current?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    })
                }, 100)
            }
        }, [isOpened])
        */

        const stats = useMemo(() => {
            const result: Property[] = []
            let skippedStats = 0
            for (const prodId of c.DisplayProps) {
                const stat = c.Stats.find(p => p.Id === prodId)
                if (stat?.Value === 0) {
                    skippedStats++
                    if (c.DisplayProps.length - skippedStats >= 4)
                        continue
                }
                if (result.length >= 4)
                    break
                if (stat) {
                    result.push(stat)
                }
            }
            return result
        }, [c.DisplayProps, c.Stats])

        return (
            <>
                <Table.Tr onClick={() => {
                    // setOpenedId(openedId === c.Id ? null : c.Id)
                    toggle()
                }}>
                    <Table.Td w="16px">{i + 1}</Table.Td>
                    <Table.Td w="30%">
                        <Group gap="sm" wrap="nowrap">
                            <Image src={c.CircleIconUrl} h="32px" />
                            <Text>{getLocalString(c.Name)}</Text>
                            <div className="chip">Lv. {c.Level}</div>
                        </Group>
                    </Table.Td>
                    <Table.Td>
                        {mindscapeChip(c.MindscapeLevel)}
                    </Table.Td>
                    <Table.Td w="56px">
                        {c.Weapon &&
                            <Group gap="-14px" align="flex-end" wrap="nowrap">
                                <Image src={c.Weapon?.ImageUrl} h="32px" />
                                <Text size="10pt">P{c.Weapon?.UpgradeLevel}</Text>
                            </Group>
                        }
                    </Table.Td>
                    <Table.Td>
                        <Group gap="8px" wrap="nowrap">
                            {
                                c.DriveDisksSet.map(set => {
                                    return (
                                        <Group key={set.Set.Id} gap="-14px" align="flex-end" wrap="nowrap">
                                            <Image src={set.Set.IconUrl} h="32px" />
                                            <Text size="10pt">{set.Count}</Text>
                                        </Group>
                                    )
                                })
                            }
                        </Group>
                    </Table.Td>
                    <Table.Td w="160px" bg="rgba(0 0 0 / 15%)">
                        <CritCell cr={c.Stats.find(p => p.Id === 20101)?.formatted.replace("%", "") ?? ""}
                            cd={c.Stats.find(p => p.Id === 21101)?.formatted.replace("%", "") ?? ""} cv={c.CritValue} />
                    </Table.Td>
                    {
                        stats.map(prop => {
                            return (
                                <PropertyCell className="is-narrow" key={prop.Id} prop={prop} />
                            )
                        })
                    }
                </Table.Tr>
                <ExpandableRow className="character-card-row" opened={isCardVisible} ref={cardContainerRef}
                    style={{ borderBottomWidth: isCardVisible ? "1px" : "0" }}>
                    <Stack gap="8px">
                        <div style={{ "--scale": cardScale, height: `${cardContainerHeight - 32}px`, display: "flex", justifyContent: "center", alignItems: "flex-start" } as React.CSSProperties}>
                            <CharacterCardMemorized ref={cardRef}
                                uid={uid} username={username}
                                character={c} substatsVisible={isSubstatsVisible} />
                        </div>
                        <Stack>
                            <Group m="xl">
                                <Button leftSection={<IconDownload />} variant="subtle" onClick={async () => {
                                    if (cardRef.current === null) return

                                    const cardRect = cardRef.current.getBoundingClientRect()
                                    const cs = cardScale
                                    setCardScale(1.0)

                                    const dataUrl = await toPng(cardRef.current, {
                                        quality: 1.0,
                                        canvasHeight: (cardRect.height) * 2,
                                        canvasWidth: (cardRect.width) * 2,
                                        backgroundColor: "transparent",
                                        style: {
                                            margin: "var(--mantine-spacing-lg)"
                                        }
                                    })

                                    const link = document.createElement("a")
                                    link.download = `${getLocalString(c.Name)}-${uid}.png`
                                    link.href = dataUrl
                                    link.click();

                                    setCardScale(cs)
                                }}>Download Image</Button>
                                { agentLeaderboards.length > 0 &&
                                    <Button leftSection={isDmgDistributionVisible ? <IconChevronUp /> : <IconChevronDown />} 
                                        variant="subtle" onClick={toggleDmgDistribution}>Show damage distribution</Button>
                                }
                                <Switch label="Substats breakdown" checked={isSubstatsVisible} onChange={toggleSubstats} />
                            </Group>
                            <Collapse in={isDmgDistributionVisible}>
                                { agentLeaderboards.length > 0 &&
                                    <DamageDistributionMemoized entries={agentLeaderboards} />
                                }
                            </Collapse>
                        </Stack>
                    </Stack>

                </ExpandableRow>
            </>
        )
    }

    return (
        <Card p="0" radius="md" shadow="lg">
            <Table stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Mindscape</Table.Th>
                        <Table.Th>Weapon</Table.Th>
                        <Table.Th>Drive Disks</Table.Th>
                        <Table.Th>Crit Value</Table.Th>
                        <Table.Th className="is-narrow">Stats</Table.Th>
                        <Table.Th className="is-narrow"></Table.Th>
                        <Table.Th className="is-narrow"></Table.Th>
                        <Table.Th className="is-narrow"></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        characters.sort((c1, c2) => c2.CritValue - c1.CritValue).map((c, i) => 
                            <CharacterRow key={c.Id} c={c} i={i} isOpened={openedId === c.Id} />)
                    }
                </Table.Tbody>
            </Table>
        </Card>
    )
}

export const CharactersTableMemorized = memo(CharactersTable)