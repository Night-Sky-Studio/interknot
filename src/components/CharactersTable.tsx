import { Character } from "../enka/data/types/Character"
import { Card, Group, Table, Image, Text, useMantineTheme } from "@mantine/core"
import "./styles/CharactersTable.css"
import { getDriveDisksSet } from "../enka/data/mappers/DriveDiskMapper"
import { calculateCritValue } from "../enka/data/mappers/CharacterMapper"


interface ICharactersTableProps {
    characters: Character[]
}

export default function CharactersTable({ characters }: ICharactersTableProps): React.ReactElement {
    const theme = useMantineTheme()
    // const [sortMode, setSortMode] = useState(0)

    // useEffect(() => {
    //     // Update tableData
    // }, [sortMode])

    const tableData = characters.map(c => {
        return {
            Id: c.Id,
            Name: c.Name,
            Level: c.Level,
            Colors: c.Colors,
            CircleIconUrl: c.CircleIconUrl,
            Mindscape: c.MindscapeLevel,
            Weapon: c.Weapon,
            DriveDiskSet: getDriveDisksSet(c.DriveDisks),
            CritValue: {
                Value: calculateCritValue(c),
                CritRate: c.Stats.find(p => p.Id === 20101),
                CritDamage: c.Stats.find(p => p.Id === 21101)
            },
            // TODO: Add character stats
        }
    })

    const mindscapeChip = (level: number) => {
        return <div className="chip mindscape-chip" style={{padding: `0.125rem ${(level / 5 + 1) * 1}rem`}} data-level={level}>
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
                        tableData.map((c, i) => {
                            return (
                                <Table.Tr key={c.Id}>
                                    <Table.Td>{i + 1}</Table.Td>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Image src={c.CircleIconUrl} h="32px" />
                                            <Text>{c.Name}</Text>
                                            <div className="chip">Lv. {c.Level}</div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        {mindscapeChip(c.Mindscape)}
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
                                                c.DriveDiskSet.map(set => {
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
                                                {c.CritValue.CritRate?.toString()} : {c.CritValue.CritDamage?.toString()}
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