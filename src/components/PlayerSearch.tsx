import { Card, CloseButton, TextInput, Title, Group, ActionIcon } from "@mantine/core"
import { IconSearch, IconSend2 } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { ProfileInfo } from "@interknot/types"
import { getProfile, searchUsers } from "../api/data"
import { useBackend } from "./BackendProvider"

export default function PlayerSearch({ search }: { search: (result: ProfileInfo[]) => void }): React.ReactElement {
    const [value, setValue] = useState(""),
        [error, setError] = useState("")

    const backend = useBackend()
    const searchEnabled = useMemo(() => backend.state?.data?.params.search_enabled ?? false, [backend.state])
    const updateEnabled = useMemo(() => backend.state?.data?.params.update_enabled ?? false, [backend.state])

    const onSearchChange = async (val: string) => {
        if (val.length >= 32) {
            setError("Input is too long")
            return
        }
        setError("")
        setValue(val)
        if (!searchEnabled) return
        search((await searchUsers(val)).data ?? [])
    }

    const onUidSubmit = async () => {
        if (!updateEnabled) return
        setError("")
        const isNumeric = (str: any): boolean => {
            if (typeof str != "string") return false 
            return !isNaN(str as any) &&
                    !isNaN(parseFloat(str))
        }
        if (!isNumeric(value)) { 
            setError("Adding profile by Nickname is not supported")
            return
        }
        try {
            const num = Number(value)
            if (num < 0 || num > 2000000000) {
                setError("Invalid UID")
                return
            }
            const user = await getProfile(Number(value))
            search(user.data ? [user.data] : [])
        } catch (e: any) {
            setError(e.message)
        }
    }

    return (
        <Card shadow="md" m="2rem 0" p="xl">
            <Card.Section>
                <Title order={3} ta="center">Proxy search</Title>
                <Group gap="xs" align="center" justify="center" mt="md">
                    <TextInput placeholder="Enter UID / Nickname..."
                        onKeyUp={async (event) => {
                            if (event.key === "Enter") {
                                onUidSubmit()
                            }
                        }}
                        value={value}
                        error={error}
                        onChange={async (event) => {
                            await onSearchChange(event.currentTarget.value)
                        }}
                        rightSectionPointerEvents="all"
                        leftSection={<IconSearch />}
                        rightSection={
                            <CloseButton aria-label="Clear input"
                                onClick={() => setValue('')}
                                style={{ display: value ? undefined : 'none' }} />
                        } />
                    <ActionIcon variant="subtle" disabled={!searchEnabled} onClick={onUidSubmit}>
                        <IconSend2 />
                    </ActionIcon>
                </Group>
            </Card.Section>
        </Card>
    )
}