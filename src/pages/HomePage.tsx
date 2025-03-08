import { Title, Text, UnstyledButton, Stack, Space, Alert } from "@mantine/core"
import React, { useState } from "react"
import PlayerSearch from "../components/PlayerSearch"
import { UserHeaderMemorized } from "../components/UserHeader"
import "./styles/HomePage.css"
import { useNavigate } from "react-router"
import { ProfileInfo } from "@interknot/types"
import { useLocalStorage } from "@mantine/hooks"
import { IconInfoCircle } from "@tabler/icons-react"

export default function HomePage(): React.ReactElement {
    const navigate = useNavigate()

    const [enkaAlertDismissed, setEnkaAlertDismissed] = useLocalStorage({ key: "enkaAlertDismissed", defaultValue: false })
    const [savedUsers, _] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [users, setUsers] = useState<ProfileInfo[]>(savedUsers ?? [])

    return (<>
        <title>Inter-Knot</title>
        <section>
            <Title order={1}>Welcome to Inter-Knot</Title>
            <Text>A place for proxies to share their agents' builds.</Text>
            {!enkaAlertDismissed && <>
                <Space h="lg" />
                <Alert variant="light" withCloseButton color="blue" 
                    title="Enka.Network is finally available!" icon={<IconInfoCircle />}
                    onClose={() => setEnkaAlertDismissed(true)}>
                    <Text>You can use your own UID to test our website.</Text>
                    <Text>
                        Please inform <Text component="a" c="blue" href="https://discordapp.com/users/225471940826103810"> @lilystilson </Text> 
                        on Discord about any encountered bugs. 
                        We're working on creating our own Discord server, please be patient.
                    </Text>
                </Alert>
            </>}
            <PlayerSearch search={(response) => {
                setUsers(response)
            }} />
            <div style={{ height: "100%" }}>
                <Stack>
                    {
                        users?.map(u => {
                            return (
                                <UnstyledButton key={u.Uid} className="profile-button"
                                    onClick={() => {
                                        navigate(`user/${u.Uid}`)
                                    }}>
                                    <UserHeaderMemorized user={u} />
                                </UnstyledButton>
                            )
                        })
                    }
                </Stack>
            </div>
        </section>
    </>)
}