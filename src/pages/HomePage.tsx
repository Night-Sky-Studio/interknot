import { Title, Text, UnstyledButton, Stack, Space, Alert } from "@mantine/core"
import React, { useState } from "react"
import PlayerSearch from "../components/PlayerSearch"
import { UserHeaderMemorized } from "../components/UserHeader"
import "./styles/HomePage.css"
import { useNavigate } from "react-router"
import { ProfileInfo } from "@interknot/types"
import { useLocalStorage } from "@mantine/hooks"
import { IconInfoTriangle } from "@tabler/icons-react"

export default function HomePage(): React.ReactElement {
    const navigate = useNavigate()

    const [savedUsers, _] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [users, setUsers] = useState<ProfileInfo[]>(savedUsers ?? [])

    return (<>
        <title>Inter-Knot - Zenless Zone Zero Leaderboards</title>
        <section>
            <Title order={1}>Welcome to Inter-Knot</Title>
            <Text>A place for proxies to share their agents' builds and compare their drive discs.</Text>
            <Space h="lg" />
            <Alert variant="light" color="orange" data-nosnippet
                title="Enka is on maintenance!" icon={<IconInfoTriangle />}>
                <Text>
                    Enka.Network is currently undergoing maintenance, profile addition and updates are temporarily disabled.
                    You can still view your cached profile data, if you have added it previously.
                </Text>
                <Text>
                    Please inform <Text c="blue" component="span"> @lilystilson </Text> on Discord about any encountered bugs. 
                    You can <Text c="blue" component="a" href="https://discord.gg/hFNheySRQD" target="_blank"> join our Discord server </Text>
                    to chat and report any encountered issues.
                </Text>
            </Alert>
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