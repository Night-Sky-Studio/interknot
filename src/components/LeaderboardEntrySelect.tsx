import { BaseLeaderboardEntry } from "@interknot/types"
import { Group, useCombobox, Combobox, InputBase, Input, Image, Text } from "@mantine/core"
import { useState, useMemo, useEffect } from "react"
import { useSettings } from "./SettingsProvider"
import { toFixedCeil } from "@/extensions/NumberExtensions"

interface ILeaderboardEntrySelectProps {
    entries: BaseLeaderboardEntry[]
    showRanking?: boolean
    initialLeaderboardId?: number
    onEntrySelect?: (entry: BaseLeaderboardEntry) => void
}

export default function LeaderboardEntrySelect({ entries, showRanking, initialLeaderboardId, onEntrySelect }: ILeaderboardEntrySelectProps): React.ReactElement {
    const { getLocalString, decimalPlaces } = useSettings()

    const SelectOption = ({ entry }: { entry: BaseLeaderboardEntry }) => {
        return (
            <Group wrap="nowrap" className="lb-select-option">
                <Image src={entry.Leaderboard.Weapon.ImageUrl} h="32px" />
                <Text miw="160px">{getLocalString(entry.Leaderboard.Weapon.Name)}</Text>
                { showRanking && 
                    <Text miw="160px">top {toFixedCeil((entry.Rank / entry.Leaderboard.Total) * 100, decimalPlaces)}%</Text>
                }
                
                <Text>{entry.Leaderboard.FullName}</Text>
            </Group>
        )
    }

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption()
    })

    const [value, setValue] = useState<string | null>(initialLeaderboardId?.toString() ?? null)
    const selectedOption = useMemo(() => entries.find(e => e.Leaderboard.Id.toString() === value), [entries, value])

    useEffect(() => {
        if (selectedOption) {
            onEntrySelect?.(selectedOption)
        }
    }, [selectedOption])

    const options = useMemo(() => entries.map(e => (
        <Combobox.Option value={e.Leaderboard.Id.toString()} key={`lb-entry-${e.Leaderboard.Id}`} 
            bg={e.Leaderboard.Id.toString() === value ? "var(--mantine-primary-color-filled)" : undefined}
            c={e.Leaderboard.Id.toString() === value ? "black" : undefined}>
            <SelectOption entry={e} />
        </Combobox.Option>
    )), [entries, value])

    return (
        <Combobox store={combobox} onOptionSubmit={(v) => {
            setValue(v)
            combobox.closeDropdown()
        }}>
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    label="Select leaderboard"
                    rightSection={<Combobox.Chevron />}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                    multiline miw="100%">
                    {selectedOption ? (
                        <SelectOption entry={selectedOption} />
                    ) : (
                        <Input.Placeholder>Pick value</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}