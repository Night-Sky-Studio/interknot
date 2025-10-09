import { AgentAction, BaseLeaderboardEntry } from "@interknot/types"
import { Stack, Group, Text, Image, useCombobox, Combobox, InputBase, Input, Flex } from "@mantine/core"
import { memo, useEffect, useMemo, useState } from "react"
import { IconEqual, IconPlus } from "@tabler/icons-react"
import DamageBar from "@components/DamageBar/DamageBar"
import "./DamageDistribution.css"
import "@components/DamageChip/DamageChip.css"
import { useSettings } from "@components/SettingsProvider"

interface ILeaderboardEntrySelectProps {
    entries: BaseLeaderboardEntry[]
    initialLeaderboardId?: number
    onEntrySelect?: (entry: BaseLeaderboardEntry) => void
}

export function LeaderboardEntrySelect({ entries, initialLeaderboardId, onEntrySelect }: ILeaderboardEntrySelectProps): React.ReactElement {
    const { getLocalString } = useSettings()

    const SelectOption = ({ entry }: { entry: BaseLeaderboardEntry }) => {
        return (
            <Group wrap="nowrap" className="lb-select-option">
                <Image src={entry.Leaderboard.Weapon.ImageUrl} h="32px" />
                <Text miw="160px">{getLocalString(entry.Leaderboard.Weapon.Name)}</Text>
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
    }, [selectedOption, onEntrySelect])

    const options = useMemo(() => entries.map(e => (
        <Combobox.Option value={e.Leaderboard.Id.toString()} key={`lb-entry-${e.Leaderboard.Id}`} 
            bg={e.Leaderboard.Id.toString() === value ? "var(--mantine-primary-color-filled)" : undefined}
            c={e.Leaderboard.Id.toString() === value ? "black" : undefined}>
            <SelectOption entry={e} />
        </Combobox.Option>
    )), [entries])

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

interface IDamageDistributionProps {
    entries: BaseLeaderboardEntry[]
    initialLeaderboardId?: number
    onLeaderboardSelect?: (lb: BaseLeaderboardEntry) => void
}

export default function DamageDistribution({ entries, initialLeaderboardId, onLeaderboardSelect }: IDamageDistributionProps): React.ReactElement {
    // const leaderboards = useLeaderboards() 
    // const characterId = entries[0].Leaderboard.Character.Id

    const idx = initialLeaderboardId ? entries.findIndex(e => e.Leaderboard.Id === initialLeaderboardId) : 0

    const [lbIdx, setLbIdx] = useState<number>(idx)
    const [hoverIdx, setHoverIdx] = useState<number>(-1)

    useEffect(() => {
        onLeaderboardSelect?.(entries[lbIdx])
    }, [lbIdx, entries, onLeaderboardSelect])

    // const { getLocalString } = useSettings()

    const rotation = useMemo(() => entries[lbIdx].RotationValue.filter(rv => rv.Damage !== 0), [entries, lbIdx])

    const DmgChipPart = ({ action, idx } : { action: AgentAction, idx: number }) => {
        return (<Group wrap="nowrap" gap="0px">
            {idx !== 0 &&
                <IconPlus size="16px" style={{ margin: "0 0.1rem" }} />
            }
            <div className="dmg-chip">
                <Text className="dc-damage">{Math.trunc(action.Damage).toLocaleString()}</Text>
            </div>
        </Group>)
    }

    return (
        <Stack ml="xl" mr="xl" mb="xl" align="flex-start">
            <LeaderboardEntrySelect
                entries={entries}
                initialLeaderboardId={initialLeaderboardId ?? entries[0].Leaderboard.Id}
                onEntrySelect={(entry) => {
                    const newIdx = entries.findIndex(e => e.Leaderboard.Id === entry.Leaderboard.Id)
                    setLbIdx(newIdx)
                }} />
            <DamageBar actions={rotation} hoverIdx={hoverIdx} onHighlight={(idx) => {
                setHoverIdx(idx)
            }} />
            <Flex gap="0.5rem 0" wrap="wrap" justify="center" align="center">
                {/* <DamageChip damage={rotation.map(r => r.Damage).reduce((prev, curr) => curr += prev)} /> */}
                <div key={`dmg-chip-part-${idx}`} className="dmg-chip">
                    <Text className="dc-damage">{Math.trunc(rotation.map(r => r.Damage).reduce((prev, curr) => curr += prev)).toLocaleString()}</Text>
                </div>
                <IconEqual size="16px" style={{ margin: "0 0.1rem" }} />
                {
                    rotation.map((action, idx) => <DmgChipPart action={action} idx={idx} key={`dmg-chip-part-${idx}`} />)
                }
            </Flex>
        </Stack>
    )
}

export const DamageDistributionMemoized = memo(DamageDistribution)