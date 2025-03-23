import { Character, LeaderboardAgent } from "@interknot/types"
import { Card, Group, Table, Image, Text, useMantineTheme, Collapse, Stack, Button } from "@mantine/core"
import "./styles/CharactersTable.css"
import { CharacterCardMemorized } from "./CharacterCard"
import { memo, useEffect, useRef, useState } from "react"
import { useDisclosure, useResizeObserver } from "@mantine/hooks"
import { IconChevronDown, IconChevronUp, IconDownload } from "@tabler/icons-react"
import { toPng } from "html-to-image"
import { useSettings } from "./SettingsProvider"
import { DamageDistributionMemoized } from "./DamageDistribution"

interface ICharactersTableProps {
    uid: number
    username: string
    characters: Character[]
    lbAgents?: LeaderboardAgent[]
}

export const cvWeight = (critValue: number) => {
    switch (true) {
        case critValue >= 200: return 800
        case critValue >= 180: return 700
        case critValue >= 170: return 600
        case critValue >= 160: return 500
        case critValue >= 150: return 400
        default: return undefined
    }
}

export default function CharactersTable({ uid, username, characters, lbAgents }: ICharactersTableProps): React.ReactElement {
    const { getLocalString } = useSettings()
    
    const cvColor = (critValue: number) => {
        const theme = useMantineTheme()
        switch (true) {
            case critValue >= 200: return theme.colors.red[7]
            case critValue >= 180: return theme.colors.pink[7]
            case critValue >= 170: return theme.colors.grape[7]
            case critValue >= 160: return theme.colors.violet[6]
            case critValue >= 150: return theme.colors.blue[5]
            default: return undefined
        }
    }
    // const [sortMode, setSortMode] = useState(0)

    // useEffect(() => {
    //     // Update tableData
    // }, [sortMode])

    const mindscapeChip = (level: number) => {
        return <div className="chip mindscape-chip" style={{ padding: `0.125rem ${(level / 5 + 1) * 1}rem` }} data-level={level}>
            <Text fw={700}>{level}</Text>
        </div>
    }

    const CharacterRow = ({ c, i }: { c: Character, i: number }) => {
        // const [openedId, setOpenedId] = useState<number | null>(null)
        const CARD_ASPECT_RATIO = 21 / 43
        const [cardScale, setCardScale] = useState(1)
        const [cardContainerHeight, setCardContainerHeight] = useState(860 * CARD_ASPECT_RATIO)
        const [cardContainerRef, cardContainerRect] = useResizeObserver()

        const [isCardVisible, { toggle }] = useDisclosure(false)
        const [isDmgDistributionVisible, { toggle: toggleDmgDistribution }] = useDisclosure(false)

        useEffect(() => {
            if (cardContainerRect.width) {
                const newScale = Math.max(cardContainerRect.width / 900, 1)
                setCardScale(newScale)
                setCardContainerHeight(Math.round(cardContainerRect.width * CARD_ASPECT_RATIO) + 20)
            }
        }, [cardContainerRect.width])
        
        const cardRef = useRef<HTMLDivElement | null>(null)

        const agentLeaderboards = lbAgents?.filter(l => l.Agent.Id === c.Id) ?? []

        return (
            <>
                <Table.Tr onClick={() => {
                    // setOpenedId(openedId === c.Id ? null : c.Id)
                    toggle()
                }}>
                    <Table.Td>{i + 1}</Table.Td>
                    <Table.Td>
                        <Group gap="sm">
                            <Image src={c.CircleIconUrl} h="32px" />
                            <Text>{getLocalString(c.Name)}</Text>
                            <div className="chip">Lv. {c.Level}</div>
                        </Group>
                    </Table.Td>
                    <Table.Td>
                        {mindscapeChip(c.MindscapeLevel)}
                    </Table.Td>
                    <Table.Td>
                        {c.Weapon &&
                            <Group gap="-14px" align="flex-end">
                                <Image src={c.Weapon?.ImageUrl} h="32px" />
                                <Text size="10pt">P{c.Weapon?.UpgradeLevel}</Text>
                            </Group>
                        }
                    </Table.Td>
                    <Table.Td>
                        <Group gap="8px">
                            {
                                c.DriveDisksSet.map(set => {
                                    return (
                                        <Group key={set.Set.Id} gap="-14px" align="flex-end">
                                            <Image src={set.Set.IconUrl} h="32px" />
                                            <Text size="10pt">{set.Count}</Text>
                                        </Group>
                                    )
                                })
                            }
                        </Group>
                    </Table.Td>
                    <Table.Td w="160px" bg="rgba(0 0 0 / 25%)">
                        <Text className="crit-cell" component="div">
                            <div>
                                {
                                    c.Stats.find(p => p.Id === 20101)?.formatted.replace("%", "")
                                } : {
                                    c.Stats.find(p => p.Id === 21101)?.formatted.replace("%", "")
                                }
                            </div>
                            <div style={{ color: cvColor(c.CritValue), fontWeight: cvWeight(c.CritValue) }}>
                                {c.CritValue} cv
                            </div>
                        </Text>
                    </Table.Td>
                    {/* Add character stats */}
                </Table.Tr>
                <Table.Tr className="character-card-row"
                    style={{ borderBottomWidth: isCardVisible ? "1px" : "0" }}>
                    <Table.Td colSpan={6} p="0" ref={cardContainerRef}>
                        <Collapse in={isCardVisible}>
                            <Stack gap="8px">
                                <div style={{ "--scale": cardScale, height: `${cardContainerHeight - 32}px`, display: "flex", justifyContent: "center", alignItems: "flex-start" } as React.CSSProperties}>
                                    {isCardVisible &&
                                        <CharacterCardMemorized ref={cardRef}
                                            uid={uid} username={username}
                                            character={c} />
                                    }
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
                                    </Group>
                                    <Collapse in={isDmgDistributionVisible}>
                                        { agentLeaderboards.length > 0 &&
                                            <DamageDistributionMemoized entries={agentLeaderboards} />
                                        }
                                    </Collapse>
                                </Stack>
                            </Stack>
                        </Collapse>
                    </Table.Td>
                </Table.Tr>
            </>
        )
    }

    return (
        <Card p="0" radius="md" shadow="lg">
            <Table stickyHeader highlightOnHover striped>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Mindscape</Table.Th>
                        <Table.Th>Weapon</Table.Th>
                        <Table.Th>Drive Disks</Table.Th>
                        <Table.Th>Crit Value</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        characters.sort((c1, c2) => c2.CritValue - c1.CritValue).map((c, i) => <CharacterRow key={c.Id} c={c} i={i} />)
                    }
                </Table.Tbody>
            </Table>
        </Card>
    )
}

export const CharactersTableMemorized = memo(CharactersTable)