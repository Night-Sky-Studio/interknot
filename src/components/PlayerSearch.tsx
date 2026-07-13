import { Card, CloseButton, TextInput, Title, Group, ActionIcon, Loader } from "@mantine/core"
import { IconSearch, IconSend2 } from "@tabler/icons-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { ProfileInfo } from "@interknot/types"
import { getProfile, searchUsers } from "../api/data"
import { useBackend } from "./BackendProvider"

function isUidValid(uid?: string | number): boolean {
    if (uid === undefined) return false
    const uidNum = typeof uid === "string" ? Number(uid) : uid
    return !isNaN(uidNum) && uidNum >= 10000000 && uidNum <= 2000000000 && Number.isInteger(uidNum)
}

function looksNumeric(str: string): boolean {
    const trimmed = str.trim()
    return trimmed.length > 0 && /^\d+$/.test(trimmed)
}

export default function PlayerSearch({ search }: { search: (result: ProfileInfo[]) => void }): React.ReactElement {
    const [value, setValue] = useState(""),
        [error, setError] = useState(""),
        [loading, setLoading] = useState(false)

    const [debounced] = useDebouncedValue(value, 250)

    const backend = useBackend()
    const searchEnabled = useMemo(() => backend.state?.data?.params.search_enabled ?? false,
        [backend.state?.data?.params.search_enabled])
    const updateEnabled = useMemo(() => backend.state?.data?.params.update_enabled ?? false,
        [backend.state?.data?.params.update_enabled])

    const fetchProfile = useCallback(async (uid: string) => {
        if (!updateEnabled) return
        setLoading(true)
        setError("")
        try {
            const user = await getProfile(Number(uid))
            if (user.error) {
                setError(user.error.message ?? user.error.status)
                return
            }
            search(user.data ? [user.data] : [])
        } catch (e: any) {
            setError(e?.message ?? "Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [updateEnabled, search])

    // react to the debounced input
    useEffect(() => {
        if (!searchEnabled) return

        const query = debounced.trim()
        if (query.length === 0) {
            search([])
            return
        }

        let canceled = false

        const run = async () => {
            // lookup existing profile
            const result = await searchUsers(query)
                .catch(() => undefined)
            if (canceled) return

            const found = result?.data ?? []
            if (found.length > 0) {
                search(found)
                return
            }

            // fallback - adding new profile
            if (isUidValid(query)) {
                await fetchProfile(query)
            } else {
                search([])
            }

        }

        run().then()

        return () => {
            canceled = true
        }
    }, [debounced, searchEnabled, fetchProfile, search])

    const onSubmit = () => {
        const query = value.trim()
        if (!looksNumeric(query)) {
            setError("Adding profile by Nickname is not supported")
            return
        }
        if (!isUidValid(query)) {
            setError("Invalid UID number")
            return
        }
        fetchProfile(query)
    }

    return (
        <Card shadow="md" m="2rem 0" p="xl">
            <Card.Section>
                <Title order={3} ta="center">Proxy search</Title>
                <Group gap="xs" align="center" justify="center" mt="md">
                    <TextInput
                        placeholder="Enter UID / Nickname..."
                        onKeyUp={(event) => {
                           if (event.key === "Enter") onSubmit()
                        }}
                        value={value}
                        error={error}
                        maxLength={32}
                        onChange={(event) => {
                           const val = event.currentTarget.value
                           if (val.length >= 32) {
                               setError("Input is too long")
                               return
                           }
                           setError("")
                           setValue(val)
                        }}
                        rightSectionPointerEvents="all"
                        leftSection={<IconSearch />}
                        rightSection={
                            <CloseButton
                               aria-label="Clear input"
                                onClick={() => setValue("")}
                                style={{ display: value ? undefined : "none" }} />
                        }
                    />
                    <ActionIcon variant="subtle" disabled={!searchEnabled || loading} onClick={onSubmit}>
                        {loading ? <Loader /> : <IconSend2 />}
                    </ActionIcon>
                </Group>
            </Card.Section>
        </Card>
    )
}