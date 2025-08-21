import { Title, Text, UnstyledButton, Stack, Space, Alert, Group, Image, MantineColor, Anchor } from "@mantine/core"
import React, { useState } from "react"
import PlayerSearch from "../components/PlayerSearch"
import { UserHeaderMemorized } from "../components/UserHeader"
import { useNavigate } from "react-router"
import { ProfileInfo } from "@interknot/types"
import { useLocalStorage } from "@mantine/hooks"
import { IconInfoCircle, IconInfoTriangle } from "@tabler/icons-react"
import { useBackend } from "../components/BackendProvider"
import "./styles/HomePage.css"
import fairy from "../../assets/fairy.png"
import { NewsFeedMemoized } from "../components/NewsFeed"

export default function HomePage(): React.ReactElement {
    const navigate = useNavigate()
    const backend = useBackend()

    const [savedUsers, _] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [users, setUsers] = useState<ProfileInfo[]>(savedUsers ?? [])

    const statusToColor = (status: string): MantineColor => {
        switch (status) {
            case "info": return "blue"
            case "warning": return "orange"
            case "error": return "red"
            default: return "blue"
        }
    }

    return (<>
        <title>Inter-Knot - Zenless Zone Zero Leaderboards</title>
        <section>
            <Title order={1}>Welcome to Inter-Knot</Title>
            <Text>A place for proxies to share their agents' builds and compare their drive discs.</Text>
            <Space h="lg" />
          
            {backend.error &&
                <Alert variant="light" color="red" title="Inter-knot data server is unavailable" 
                icon={<IconInfoCircle />} data-nosnippet>
                    <Group mb="md">
                        <Image src={fairy} h="64px" alt="Fairy" />
                        <Text fs="italic">Either we forgot to pay our electricity bills or there's something wrong with your internet connection...</Text>
                    </Group>
                    <Text ff="monospace">Error {backend.error.code}: {backend.error.message}</Text>
                </Alert>
            }

            {backend.state &&
                <Alert variant="light" 
                    color={statusToColor(backend.state.params.status)} 
                    title={backend.state.params.title} 
                    icon={backend.state.params.status === "info" ? <IconInfoCircle /> : <IconInfoTriangle />}
                    data-nosnippet>
                    <Stack>
                        <Text dangerouslySetInnerHTML={{ __html: backend.state.params.message }}></Text>
                        <Text>
                            Please inform <Text c="blue" component="span"> @lilystilson </Text> on Discord about any encountered bugs. 
                            You can <Anchor href="https://discord.gg/hFNheySRQD" target="_blank"> join our Discord server</Anchor> to
                            chat and report any encountered issues.
                        </Text>
                    </Stack>
                </Alert>
            }
          
            <PlayerSearch search={(response) => {
                setUsers(response)
            }} />
            {users.length !== 0 && <Stack mb="2rem">
                {
                    users.map(u => {
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
            </Stack>}
            <NewsFeedMemoized />
        </section>
    </>)
}