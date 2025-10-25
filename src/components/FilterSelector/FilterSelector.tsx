import { useBackend } from "@components/BackendProvider"
import { useSettings } from "@components/SettingsProvider"
import { Group, Loader, MultiSelect, Text, Title, Image, Center } from "@mantine/core"
import { useMemo } from "react"
import { ZenlessIcon } from "../icons/Icons"
export interface IFilterSelectorProps {
    value?: string[]
    exclude?: string[]
    onFilterApply: (filters: string[]) => void
}

export default function FilterSelector({ value, exclude, onFilterApply }: IFilterSelectorProps) {
    const { getLocalString } = useSettings()
    const { state: backend } = useBackend()

    const filters = useMemo(() => backend?.filters, [backend])

    const excludedColumns = useMemo(() => new Set(exclude ?? []), [exclude])

    const filterGroups = useMemo(() => {
        if (!filters) return undefined
        return Object.entries(filters)
            .map(([group, filter]) => {
                const items = filter
                    .filter(v => !excludedColumns.has(v.column))
                    .map(v => {
                        let label = getLocalString(v.label)
                        if (group.includes("2-Piece")) {
                            label = `2p ${label}`
                        }
                        if (group.includes("4-Piece")) {
                            label = `4p ${label}`
                        }
                        return {
                            value: `${v.column}:${v.value}`,
                            label
                        }
                    })
                if (!items.length) return null
                return { group, items }
            })
            .filter((g): g is { group: string; items: { value: string; label: string }[] } => g !== null)
    }, [filters, excludedColumns, getLocalString])

    const filterItems = useMemo(() => {
        const result: Map<string, { group: string, label: string, value: string, img?: string }> = new Map()

        Object.entries(filters ?? {}).forEach(([group, f]) => {
            f.forEach(v => {
                if (excludedColumns.has(v.column)) return
                let label = getLocalString(v.label)
                if (group.includes("2-Piece")) {
                    label = `2p ${label}`
                }
                if (group.includes("4-Piece")) {
                    label = `4p ${label}`
                }
                result.set(`${v.column}:${v.value}`, { group, label, value: v.value, img: v.img })
            })
        })

        return result
    }, [filters, excludedColumns, getLocalString])

    return (<>
        {
            !filterGroups && <Center><Loader type="dots" /></Center>
        }
        {
            filterGroups &&
                <MultiSelect 
                    data={filterGroups} 
                    renderOption={({ option }) => {
                        const item = filterItems.get(option.value)
                        if (!item) return <Text>{ option.value }</Text>
                        const hasIcon = /[M|P]\d/.test(option.label)
                        if (item.group === "Region") {
                            return <Title className="user-info" order={6}>{item.label}</Title>
                        }
                        return <Group>
                            { item?.img !== undefined && <Image src={item.img} w="32px" h="32px" /> }
                            { item?.img === undefined && !hasIcon && <ZenlessIcon id={Number(item.value)} size={18} color="white" /> }
                            <Text>{ item?.label }</Text>
                        </Group>
                    }}
                    maxDropdownHeight={480}
                    styles={{
                        dropdown: { 
                            boxShadow: "rgba(0 0 0 / 50%) 0px 16px 32px",
                            zIndex: 100,
                        }, 
                        group: {
                            marginBottom: "0.5rem"
                        },
                        groupLabel: { 
                            fontWeight: 600, 
                            color: "white",
                            fontSize: "1.25rem"
                        } 
                    }}
                    placeholder="Filter by..." 
                    searchable 
                    clearable 
                    hidePickedOptions 
                    value={value}
                    onChange={onFilterApply} />
        }
    </>)
}