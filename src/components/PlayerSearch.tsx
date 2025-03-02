import { Card, Center, CloseButton, TextInput, Title, Text, Group, Alert, Image } from "@mantine/core"
import { IconInfoCircle, IconSearch } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Profile } from "@interknot/types"
import { pingDataServer, searchUsers } from "../api/data"
import { useAsync } from "react-use"
import { useDisclosure } from "@mantine/hooks"
import fairy from "../../assets/fairy.png"

export default function PlayerSearch({ search }: { search: (result: Profile[]) => void }): React.ReactElement {
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
        setValue(val)
        search(await searchUsers(val))
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
                <Center>
                    <TextInput placeholder="Enter UID / Nickname..."
                        value={value}
                        onChange={async (event) => {onSearchChange(event.currentTarget.value)}}
                        rightSectionPointerEvents="all"
                        mt="md"
                        leftSection={<IconSearch />}
                        rightSection={
                            <CloseButton aria-label="Clear input"
                                onClick={() => setValue('')}
                                style={{ display: value ? undefined : 'none' }} />
                        } />
                </Center>
            </Card.Section>
        </Card>
    )
}