import { Card, Center, CloseButton, TextInput, Title } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"

export default function PlayerSearch(): React.ReactElement {
    const [value, setValue] = useState(""),
         [error, setError] = useState("")

    return (
        <Card shadow="md" m="2rem 0" p="xl">
            <Card.Section>
                <Title order={3} ta="center">Proxy search</Title>
                <Center>
                    <TextInput placeholder="Enter UID / Nickname..."
                        value={value}
                        onChange={(event) => { 
                            setValue(event.currentTarget.value)
                            if (event.currentTarget.value !== "") {
                                setError("Enka API is currently unavailable")
                            } else {
                                setError("")
                            }
                        }}
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
            </Card.Section>
        </Card>
    )
}