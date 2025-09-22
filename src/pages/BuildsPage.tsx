import { restoreProperties } from "@/api/data"
import CritCell from "@/components/cells/CritCell"
import DriveDiscsCell from "@/components/cells/DriveDiscsCell"
import PropertyCell from "@/components/cells/PropertyCell"
import WeaponCell from "@/components/cells/WeaponCell"
import FilterSelector from "@/components/FilterSelector/FilterSelector"
import GameObject from "@/components/GameObject/GameObject"
import { useSettings } from "@/components/SettingsProvider"
import { ServerChip } from "@/components/UserHeader/UserHeader"
import { useQueryParams } from "@/hooks/useQueryParams"
import { url, ICursoredResult, Character, ProfileInfo, Property } from "@interknot/types"
import { Stack, Card, LoadingOverlay, Group, Pagination, Button, Select, Text, Image, Alert, Anchor, Title, Flex } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import { DataTable } from "mantine-datatable"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useAsync } from "react-use"

export default function BuildsPage(): React.ReactElement {
    const navigate = useNavigate()
    // const [searchParams, _] = useSearchParams()

    const { getLocalString } = useSettings()

    // const cursor = String(searchParams.get("cursor") ?? undefined)
    // const limit = Number(searchParams.get("limit") ?? 20)

    // const [cursor, setCursor] = useState<string | undefined>(undefined)
    // const [limit, setLimit] = useState(20)
    // const [filterQuery, setFilterQuery] = useState<Record<string, string>>({})

    const [{ cursor, limit, ...filterQuery }, setQueryParams] = useQueryParams()
    const limitNum = useMemo(() => Number(limit) || 20, [limit])

    const charactersState = useAsync(async () => {
        const response = await fetch(url({
            base: "http://localhost:5100",
            path: "/characters",
            query: {
                cursor: cursor?.toString(),
                limit: limit?.toString(),
                ...filterQuery
            }
        }))
        const result = await response.json()
        return restoreProperties(result) as ICursoredResult<Character & { BuildId: number, ProfileInfo?: ProfileInfo }, string>
    }, [cursor, limit, filterQuery])

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
        for (const prodId of (c.DisplayProps ?? [])) {
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

    const [page, setPage] = useState<number | undefined>(cursor === undefined ? 1 : undefined)

    
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
    }, [charactersState.value?.totalCountHash])

    const totalCount = useMemo(() => totalCountState.value, [totalCountState.value])

    return <Stack>
        <Alert variant="light" color="blue" 
            title={<Title order={3}>Builds Browser</Title>} icon={<IconInfoCircle />}>
            <Stack gap="xs">
                <Text>
                    This page is <b>JUST</b> a list of all characters and saved builds 
                    we have in our database. It <b>SHOULD NOT</b> be used for ranking, there 
                    are <Anchor href="/leaderboards" onClick={(e) => {
                        e.preventDefault()
                        navigate("/leaderboards")
                    }}>Leaderboards</Anchor> for that.
                </Text>
                <Text>
                    This page can be used to find various builds that other players have made.
                    You can also use filters to find out which characters are using a specific
                    weapon, drive disc set and so on.
                </Text>
                <Stack gap="0">
                    <Text>Some examples:</Text>
                    <Stack component="ul" gap="0.25rem">
                        <li><Anchor c="white" href="/builds?character_id=1091" onClick={(e) => {
                            e.preventDefault()
                            setQueryParams({ character_id: "1091" }, true)
                        }}>
                            <Group gap="0">What weapons are used on <GameObject img="https://enka.network/ui/zzz/IconRoleCircle13.png" name="Avatar_Female_Size02_Unagi" />?</Group>
                        </Anchor></li>
                        <li><Anchor c="white" href="/builds?partial_sets=31000&full_set=32700" onClick={(e) => {
                            e.preventDefault()
                            setQueryParams({ partial_sets: "31000", full_set: "32700" }, true)
                        }}>
                            <Group gap="0">
                                Which characters have 
                                    <GameObject img="https://enka.network/ui/zzz/SuitBranch&BladeSong.png"
                                        name="EquipmentSuit_32700_name" /> and
                                    <GameObject img="https://enka.network/ui/zzz/SuitWoodpeckerElectro.png"
                                        name="EquipmentSuit_31000_name" /> drive discs equipped?
                            </Group>
                        </Anchor></li>
                        <li><Anchor c="white" href="/builds?character_id=1261&disc_main_stats=23103" onClick={(e) => {
                            e.preventDefault()
                            setQueryParams({ character_id: "1261", disc_main_stats: "23103" }, true)
                        }}>
                            <Group gap="0">
                                Are <GameObject propId={23103} name="PenRatio" /> discs popular on
                                <GameObject img="https://enka.network/ui/zzz/IconRoleCircle24.png" name="Avatar_Female_Size03_JaneDoe" />?
                            </Group>
                        </Anchor></li>
                    </Stack>
                </Stack>
            </Stack>
        </Alert>
        <FilterSelector 
            value={Object.entries(filterQuery).flatMap(([k, v]) => {
                if (v === undefined) return []
                return v.toString().split(",").map(s => `${k}:${s}`)
            })}
            onFilterApply={(val) => {
                const q: Record<string, string> = {}
                val.forEach(v => {
                    const add = (g: string, s: string) => {
                        if (q[g]) {
                            q[g] += `,${s}`
                        } else {
                            q[g] = s
                        }
                    }
                    const [g, val] = v.split(":")
                    switch (g) {
                        case "disc_set":
                            add("partial_sets", val)
                            add("full_set", val)
                            break
                        case "prop_id":
                            break
                        default: 
                            add(g, val)
                            break
                    }
                })
                // console.log(q)
                setQueryParams((prev) => ({ cursor: undefined, limit: prev.limit, ...q }), true)
                setPage(1)
            }} />
        {
            characters && 
                <Card p="0" pos="relative" withBorder>
                    <LoadingOverlay visible={charactersState.loading} zIndex={9}
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
                                            title: "Id",
                                            width: "7ch",
                                            cellsStyle: () => ({ maxWidth: "7ch" })
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
                                            // cellsStyle: () => ({ width: "160px" }),
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
                                            visibleMediaQuery: () => `(min-width: 1290px)`,
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
                        <Flex mb="1rem" mx="1rem" justify="space-between" align="center" wrap="wrap">
                            <div style={{ width: "25%" }} />
                            <Group>
                                <Pagination.Root total={totalCount ? Math.ceil(totalCount / limitNum) : 1} 
                                    onFirstPage={() => {
                                        setPage(1)
                                        // setCursor(undefined)
                                        setQueryParams({ cursor: undefined })
                                    }}
                                    onLastPage={() => {
                                        setPage(totalCount ? Math.ceil(totalCount / limitNum) : 1)
                                        // setCursor("gte:crit_value=0;id=0")
                                        setQueryParams({ cursor: "gte:crit_value=0;id=0" })
                                    }}
                                    onNextPage={() => {
                                        setPage((p) => p ? p + 1 : p)
                                        if (cursor?.includes("gte:")) {
                                            // setCursor((cur) => cur?.replace("gte", "lte"))
                                            setQueryParams((prev) => ({ ...prev, cursor: prev.cursor?.toString()?.replace("gte", "lte") }))
                                        } else {
                                            // setCursor(charactersState.value?.cursor)
                                            setQueryParams({ cursor: charactersState.value?.cursor })
                                        }
                                    }}
                                    onPreviousPage={() => {
                                        setPage((p) => p ? p - 1 : p)
                                        if (page === 1) {
                                            setQueryParams({ cursor: undefined })
                                        } else {
                                            setQueryParams({ cursor: `gte:crit_value=${characters[0].CritValue};id=${characters[0].BuildId}` })
                                        }
                                    }}>
                                    <Group gap="xs">
                                        <Pagination.First disabled={page === 1} />
                                        <Pagination.Previous disabled={page === 1} />
                                        <Button variant="filled" autoContrast>{page ?? "??"}</Button>
                                        <Pagination.Next disabled={charactersState.value?.hasNextPage === false} />
                                        <Pagination.Last disabled={charactersState.value?.hasNextPage === false} />
                                    </Group>
                                </Pagination.Root>
                                <Select w="128px"
                                    data={[20, 50].map((i) => ({ value: `${i}`, label: `${i} / page` }))}
                                    value={limitNum.toString()}
                                    onChange={(value) => {
                                        if (value) {
                                            setPage(1)
                                            setQueryParams({ cursor: undefined, limit: value })
                                        }
                                    }} />
                            </Group>
                            { !page && 
                                <Text mr="1rem">Showing unknown page of {totalCount ?? "unknown count"}</Text>
                            }
                            { page &&
                                <Text mr="1rem">Showing {limitNum * (page - 1) + 1} - {totalCount ? Math.min(totalCount, limitNum * page) : "?"} of {totalCount ?? "unknown count"}</Text>
                            }
                        </Flex>
                    </Stack>
                </Card>
        }
    </Stack>
}