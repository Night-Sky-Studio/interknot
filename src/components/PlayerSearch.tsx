import { Card, CloseButton, TextInput, Title, Text, Group, Alert, Image, ActionIcon } from "@mantine/core"
import { IconInfoCircle, IconSearch, IconSend2 } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { ProfileInfo } from "@interknot/types"
import { getUser, pingDataServer, searchUsers } from "../api/data"
import { useAsync } from "react-use"
import { useDisclosure } from "@mantine/hooks"
import fairy from "../../assets/fairy.png"

export default function PlayerSearch({ search }: { search: (result: ProfileInfo[]) => void }): React.ReactElement {
    const [value, setValue] = useState(""),
        [error, setError] = useState(""),
        [alertVisible, { open, close }] = useDisclosure(false)

    const dataServer = useAsync(async () => {
        return await pingDataServer()
    }, [])

    useEffect(() => {
        if (dataServer.error) {
            setError(dataServer.error?.message ?? "...stack trace must be here")
            open()
        } else {
            close()
        }
    }, [dataServer.error])

    const onSearchChange = async (val: string) => {
        setError("")
        setValue(val)
        search(await searchUsers(val))
    }

    const onUidSubmit = async () => {
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
            const user = await getUser(Number(value))
            search(user ? [user.Information] : [])
        } catch (e: any) {
            setError(e.message)
        }
    }

    return (
        <Card shadow="md" m="2rem 0" p="xl">
            {alertVisible && 
                <Card.Section>
                    <Alert variant="light" color="red" title="Inter-knot data server is unavailable" icon={<IconInfoCircle />}>
                        <Group mb="md">
                            <Image src={fairy} h="64px" alt="Fairy" />
                            <Text fs="italic">Looks like we forgot to pay our electricity bills...</Text>
                        </Group>
                        <Text ff="monospace">Error: {error}</Text>
                    </Alert>
                </Card.Section>
            }
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
                        onChange={async (event) => { await onSearchChange(event.currentTarget.value)} }
                        rightSectionPointerEvents="all"
                        leftSection={<IconSearch />}
                        rightSection={
                            <CloseButton aria-label="Clear input"
                                onClick={() => setValue('')}
                                style={{ display: value ? undefined : 'none' }} />
                        } />
                    <ActionIcon variant="subtle" onClick={onUidSubmit}>
                        <IconSend2 />
                    </ActionIcon>
                </Group>
            </Card.Section>
        </Card>
    )
}