import { Title, Text, Container, Center } from "@mantine/core"
import React from "react"
import PlayerSearch from "../components/PlayerSearch";

export default function HomePage(): React.ReactElement {
    return (
        <section>
            <Container size="xl">
                <Title order={1}>Welcome to Inter-Knot</Title>
                <Text>A place for proxies to share their agents' builds.</Text>
                <PlayerSearch />
            </Container>
        </section>
    );
}