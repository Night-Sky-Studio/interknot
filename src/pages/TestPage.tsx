import { Center, Stack, Group, Image, Text, Card, GroupProps, Tooltip, useMantineTheme, Table, Pagination, ActionIcon, LoadingOverlay } from "@mantine/core"
import { BaseWeapon, type Character, DriveDiscSet, type ICursoredResult, type ProfileInfo, Property, url, Weapon } from "@interknot/types"
import { useAsync } from "react-use"
import { useMemo, useState } from "react"
import { useSettings } from "@/components/SettingsProvider"
import { restoreProperties } from "@/api/data"
import { DataTable } from "mantine-datatable"
import { ServerChip } from "@/components/UserHeader/UserHeader"
import "@components/cells/styles/CritCell.css"
import "@components/cells/styles/WeaponCell.css"
import "./styles/TestPage.css"
import { ZenlessIcon } from "@/components/icons/Icons"

interface IWeaponCellProps {
    weapon: Weapon | null
    compareWith?: BaseWeapon | null
}

function WeaponCell({ weapon, compareWith }: IWeaponCellProps): React.ReactElement {
    const matches = useMemo(() => {
        if (!compareWith) return false;
        return weapon?.Id !== compareWith.Id;
    }, [weapon, compareWith]);
    const { getLocalString } = useSettings()
    return (
        <div className="weapon-cell">
            {weapon && 
                <Tooltip label={getLocalString(weapon.Name)} openDelay={500} portalProps={{ reuseTargetNode: true }}>
                    <Group gap="-14px" className={compareWith && matches ? "strike" : ""} align="flex-end" w="fit-content" wrap="nowrap">
                        <Image src={weapon.ImageUrl} h="32px" />
                        <Text size="10pt" className={compareWith && !matches && weapon.UpgradeLevel !== 1 ? "strike" : ""}>P{weapon?.UpgradeLevel}</Text>
                    </Group>
                </Tooltip>
            }
        </div>
    )
}

function CritCell({ cr, cd, cv }: { cr: string, cd: string, cv: number }): React.ReactElement {
    const cvWeight = (critValue: number) => {
        switch (true) {
            case critValue >= 200: return 800
            case critValue >= 180: return 700
            case critValue >= 170: return 600
            case critValue >= 160: return 500
            case critValue >= 150: return 400
            default: return undefined
        }
    }
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

    return (
        <div className="crit-cell">
            <div>
                { cr } : { cd }
            </div>
            <div style={{ color: cvColor(cv), fontWeight: cvWeight(cv) }}>
                {cv} cv
            </div>
        </div>
    )
}

interface IDriveDiscsCellProps extends GroupProps {
    sets: DriveDiscSet[]
}

function DriveDiscsCell({ sets, ...props }: IDriveDiscsCellProps): React.ReactElement {
    const { getLocalString } = useSettings()
    return (
        <Group w="160px" gap="8px" wrap="nowrap" {...props}>
            {
                sets.map(set => {
                    return (
                        <Tooltip key={set.Set.Id} label={getLocalString(set.Set.Name)} openDelay={500} 
                            portalProps={{ reuseTargetNode: true }}>
                            <Group gap="-14px" align="flex-end" wrap="nowrap">
                                <Image src={set.Set.IconUrl} h="32px" /> 
                                <Text size="10pt">{set.Count}</Text>
                            </Group>
                        </Tooltip>
                    )
                })
            }
        </Group>
    )
}

function PropertyCell({ ref, prop, className }: { ref?: any, prop: Property, className?: string }): React.ReactElement {
    return (
        <Group gap="4px" ref={ref} wrap="nowrap" className={className}>
            <ZenlessIcon id={prop.Id} size={18} color="white" />
            <span>{prop.formatted}</span>
        </Group>
    )
}

export default function TestPage() {
    const { getLocalString, getLevel } = useSettings()
    const uid = Number(1500438496)

    const [cursor, setCursor] = useState<string | undefined>(undefined)
    const [limit, setLimit] = useState(20)

    const charactersState = useAsync(async () => {
        const response = await fetch(url({
            base: "http://localhost:5100",
            path: "/characters",
            query: {
                cursor: cursor,
                limit: limit.toString()
            }
        }))
        const result = await response.json()
        return restoreProperties(result) as ICursoredResult<Character & { BuildId: number, ProfileInfo?: ProfileInfo }, string>
    }, [uid, cursor, limit])

    const characters = useMemo(() => charactersState.value?.data, [charactersState.value?.data])

    const mindscapeChip = (level: number) => {
        return (
            <div className="chip mindscape-chip" style={{ padding: `0.125rem ${(level / 5 + 1) * 1}rem` }} data-level={level}>
                <Text fw={700}>{level}</Text>
            </div>
        )
    }

    // Extract up to 4 primary stats in the same way as before
    const getTopStats = (c: Character): Property[] => {
        const result: Property[] = []
        let skippedStats = 0
        for (const prodId of c.DisplayProps) {
            const stat = c.Stats.find((p) => p.Id === prodId)
            if (stat?.Value === 0) {
                skippedStats++
                if (c.DisplayProps.length - skippedStats >= 4) continue
            }
            if (result.length >= 4) break
            if (stat) result.push(stat)
        }
        return result
    }

    const [page, setPage] = useState(1)
    
    const totalCountState = useAsync(async () => {
        const response = await fetch(url({
            base: "http://localhost:5100",
            path: "/characters/count",
            query: {
                hash: charactersState.value?.totalCountHash
            }
        }))
        const result = await response.json()
        return result.data
    }, [charactersState.value])

    const totalCount = useMemo(() => totalCountState.value, [totalCountState.value])

    return <Stack>
        {
            characters && 
                <Card p="0" pos="relative" withBorder>
                    <LoadingOverlay visible={charactersState.loading} zIndex={1000} 
                        overlayProps={{ radius: "sm", blur: 2 }} />
                    <Stack>
                        <DataTable
                            highlightOnHover
                            className="data-table"
                            // borderRadius="sm"
                            groups={[
                                {
                                    id: "main",
                                    title: "",
                                    columns: [
                                        {
                                            accessor: "BuildId",
                                            title: "Id"
                                        },
                                        { 
                                            accessor: "ProfileInfo.Nickname",
                                            title: "Owner",
                                            render: (c) => (
                                                <Group gap="sm" wrap="nowrap">
                                                    <ServerChip uid={c.ProfileInfo?.Uid.toString() ?? ""} />
                                                    <Text style={{ whiteSpace: "nowrap" }}>{c.ProfileInfo?.Nickname}</Text>
                                                </Group>
                                            )
                                        },
                                        {
                                            accessor: "Name",
                                            title: "Name",
                                            render: (c) => (
                                                <Group gap="sm" wrap="nowrap">
                                                    <Image src={c.CircleIconUrl} h="32px" />
                                                    <Text style={{ whiteSpace: "nowrap" }}>{getLocalString(c.Name)}</Text>
                                                </Group>
                                            )
                                        },
                                        { 
                                            accessor: "MindscapeLevel",
                                            title: "Mindscape",
                                            render: (c) => mindscapeChip(c.MindscapeLevel)
                                        },
                                        { 
                                            accessor: "Weapon",
                                            render: (c) => <WeaponCell weapon={c.Weapon} />
                                        },
                                        { 
                                            accessor: "DriveDisksSet",
                                            title: "Drive Discs",
                                            cellsStyle: () => ({ width: "160px" }),
                                            render: (c) => <DriveDiscsCell sets={c.DriveDisksSet}  />
                                        },
                                        { 
                                            accessor: "CritValue",
                                            title: "Crit Value",
                                            cellsStyle: () => ({ 
                                                width: "calc(10rem * var(--mantine-scale))",
                                                background: "rgba(0 0 0 / 15%)" 
                                            }) ,
                                            render: (c) => (
                                                <CritCell
                                                    cr={c.Stats.find((p) => p.Id === 20101)?.formatted.replace("%", "") ?? ""}
                                                    cd={c.Stats.find((p) => p.Id === 21101)?.formatted.replace("%", "") ?? ""}
                                                    cv={c.CritValue}
                                                />
                                            )
                                        }
                                    ]
                                },
                                { 
                                    id: "stats",
                                    title: "",

                                    columns: [
                                        ...[0, 1, 2, 3].map((idx) => ({
                                            accessor: `stat-${idx}`,
                                            title: idx === 0 ? "Stats" : "",
                                            cellsStyle: () => ({ background: "rgba(0 0 0 / 5%)" }),
                                            render: (c: Character) => {
                                                const stats = getTopStats(c)
                                                const prop = stats[idx]
                                                return prop ? <PropertyCell key={prop.Id} prop={prop} /> : null
                                            }
                                        }))
                                    ]
                                }
                            ]}
                            records={characters}
                            idAccessor="BuildId"
                            // onRecordsPerPageChange={(l) => {
                            //     setLimit(l)
                            // }}
                        />
                        <Center style={{ position: "relative", marginBottom: "1rem" }}>
                            <Pagination.Root total={totalCount ? Math.ceil(totalCount / limit) : 1} 
                                onFirstPage={() => {
                                    setPage(1)
                                    setCursor(undefined)
                                }}
                                onNextPage={() => {
                                    setPage((p) => p + 1)
                                    if (cursor?.includes("gte:")) {
                                        setCursor((cur) => cur?.replace("gte", "lte"))
                                    } else {
                                        setCursor(charactersState.value?.cursor)
                                    }
                                }}
                                onPreviousPage={() => {
                                    setPage((p) => p - 1)
                                    if (page === 1) {
                                        setCursor(undefined)
                                    } else {
                                        setCursor(`gte:crit_value=${characters[0].CritValue};id=${characters[0].BuildId}`)
                                    }
                                }}>
                                <Group gap="xs">
                                    <Pagination.First />
                                    <Pagination.Previous />
                                    <ActionIcon variant="filled" autoContrast>{page}</ActionIcon>
                                    <Pagination.Next />
                                    <Pagination.Last disabled />
                                </Group>
                            </Pagination.Root>
                            <Text style={{ position: "absolute", right: "1rem" }}>Showing {limit * (page - 1) + 1} - {Math.min(totalCount, limit * page)} of {totalCount}</Text>
                        </Center>
                    </Stack>
                </Card>
        }
    </Stack>
}