import { useEffect, useState } from "react"
import { Character, getCharacterCritValue } from "../enka/data/types/Character"
import { Card, Group, Table, Image, Text, Chip, defaultVariantColorsResolver, useMantineTheme, Flex } from "@mantine/core"
import "./styles/CharactersTable.css"


interface ICharactersTableProps {
    characters: Character[]
}

export default function CharactersTable({ characters }: ICharactersTableProps): React.ReactElement {
    const theme = useMantineTheme()
    const [sortMode, setSortMode] = useState(0)

    useEffect(() => {
        // Update tableData
    }, [sortMode])

    const tableData = characters.map(c => {
        return {
            Id: c.Id,
            Name: c.Name,
            Colors: c.Colors,
            CircleIconUrl: c.CircleIconUrl,
            Mindscape: c.MindscapeLevel,
            Weapon: c.Weapon,
            CritValue: getCharacterCritValue(c),
            // TODO: Add character stats
        }
    })

    const mindscapeChip = (level: number) => {
        return <div className="mindscape-chip" style={{padding: `0.125rem ${(level / 5 + 1) * 1}rem`}} data-level={level}>
            <Text fw={700}>{level}</Text>
        </div>
    }

    const cvColor = (critValue: number) => {
        switch (true) {
            case critValue >= 230: return theme.colors.pink[7]
            case critValue >= 220: return theme.colors.grape[7]
            case critValue >= 200: return theme.colors.violet[6]
            case critValue >= 180: return theme.colors.blue[5]
            default: return undefined
        }
    }
    const cvWeight = (critValue: number) => {
        switch (true) {
            case critValue >= 230: return 800
            case critValue >= 220: return 700
            case critValue >= 200: return 600
            case critValue >= 180: return 500
            default: return undefined
        }
    }

    return (
        <Card p="0" radius="md">
            <Table stickyHeader highlightOnHover striped>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Mindscape</Table.Th>
                        <Table.Th>Weapon</Table.Th>
                        <Table.Th>Crit Value</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        tableData.map((c, i) => {
                            return (
                                <Table.Tr key={c.Id}>
                                    <Table.Td>{i + 1}</Table.Td>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Image src={c.CircleIconUrl} h="32px" />
                                            <Text>{c.Name}</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        {mindscapeChip(c.Mindscape)}
                                        </Table.Td>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Image src={c.Weapon?.ImageUrl} h="32px" />
                                            <Text>{c.Weapon?.Name}</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td w="160px" bg="rgba(0 0 0 / 25%)">
                                        <Text className="crit-cell" component="div">
                                            <div>
                                                {c.CritValue.CritRate.toString()} : {c.CritValue.CritDamage.toString()}
                                            </div>
                                            <div style={{ color: cvColor(c.CritValue.Value), fontWeight: cvWeight(c.CritValue.Value)}}>
                                                {c.CritValue.Value} cv
                                            </div>
                                        </Text>
                                    </Table.Td>
                                    {/* Add character stats */}
                                </Table.Tr>
                            )
                        })
                    }
                </Table.Tbody>
            </Table>
        </Card>
    )
}