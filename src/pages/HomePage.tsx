import { Title, Text, UnstyledButton, Stack } from "@mantine/core"
import React, { useState } from "react"
import PlayerSearch from "../components/PlayerSearch"
import { UserHeaderMemorized } from "../components/UserHeader"
import "./styles/HomePage.css"
import { useNavigate } from "react-router"
import { Profile } from "@interknot/types"
import { useLocalStorage } from "@mantine/hooks"

export default function HomePage(): React.ReactElement {
    const navigate = useNavigate()

    const [savedUsers, _] = useLocalStorage<Profile[]>({ key: "savedUsers", defaultValue: [] })
    const [users, setUsers] = useState<Profile[]>(savedUsers ?? [])

    return (
        <section>
            <Title order={1}>Welcome to Inter-Knot</Title>
            <Text>A place for proxies to share their agents' builds.</Text>
            <PlayerSearch search={(response) => {
                setUsers(response)
            }} />
            <div style={{ height: "100%" }}>
                <Stack>
                    {
                        users?.map(u => {
                            return (
                                <UnstyledButton key={u.Information.Uid} className="profile-button"
                                    onClick={() => {
                                        navigate(`user/${u.Information.Uid}`)
                                    }}>
                                    <UserHeaderMemorized user={u.Information} />
                                </UnstyledButton>
                            )
                        })
                    }
                </Stack>
            </div>
        </section>
    )
}