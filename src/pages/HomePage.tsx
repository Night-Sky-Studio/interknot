import { Title, Text, ScrollArea, Space, Button, UnstyledButton, Stack } from "@mantine/core"
import React from "react"
import PlayerSearch from "../components/PlayerSearch"
import Users from "../mock/MockUsers"
import UserHeader from "../components/UserHeader"
import "./styles/HomePage.css"
import { useNavigate } from "react-router"
import { mapProfile } from "../enka/data/mappers/ProfileMapper"

export default function HomePage(): React.ReactElement {
    const navigate = useNavigate()
    return (
        <section>
            <Title order={1}>Welcome to Inter-Knot</Title>
            <Text>A place for proxies to share their agents' builds.</Text>
            <PlayerSearch />
            <div style={{ height: "100%" }}>
                <Stack>
                    {
                        Users.map(u => {
                            let user = mapProfile(u)
                            return (
                                <UnstyledButton key={user.Uid} className="profile-button"
                                    onClick={() => navigate(`user/${user.Uid}`)}>
                                    <UserHeader user={user} />
                                </UnstyledButton>
                            )
                        })
                    }
                </Stack>
            </div>
        </section>
    );
}