import { Card, Center, CloseButton, TextInput, Title, Text, Anchor, Group, Space } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { Profile } from "../../backend/data/types/Profile"
import { devListAllUsers, searchUsers } from "../api/data"
import { useAsync } from "react-use"

export default function PlayerSearch({ search }: { search: (result: Profile[]) => void }): React.ReactElement {
    const [value, setValue] = useState(""),
        [error, _] = useState("")

    const allUsers = useAsync(async () => {
        return await devListAllUsers()
    }, [])

    const onSearchChange = async (val: string) => {
        setValue(val)
        search(await searchUsers(val))
    }

    return (
        <Card shadow="md" m="2rem 0" p="xl">
            <Card.Section>
                <Title order={3} ta="center">Proxy search</Title>
                <Center>
                    <TextInput placeholder="Enter UID / Nickname..."
                        value={value}
                        onChange={async (event) => {onSearchChange(event.currentTarget.value)}}
                        rightSectionPointerEvents="all"
                        mt="md"
                        leftSection={<IconSearch />}
                        error={error}
                        rightSection={
                            <CloseButton aria-label="Clear input"
                                onClick={() => setValue('')}
                                style={{ display: value ? undefined : 'none' }} />
                        } />
                </Center>
                <Group align="center" justify="center" mt="lg" gap="xs">
                    <Text>Currently available UIDs:</Text> 
                    <span>
                        {   
                            allUsers.value?.map(v => (
                                <><Anchor key={v} onClick={() => {onSearchChange(v.toString())}}>{v}</Anchor> </>
                            ))
                        }
                    </span>
                </Group>
            </Card.Section>
        </Card>
    )
}