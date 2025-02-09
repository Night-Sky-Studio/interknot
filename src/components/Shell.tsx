import { ActionIcon, AppShell, Button, Container, Flex, Group, Title, Text } from '@mantine/core'
import { IconBrandDiscordFilled, IconBrandPatreonFilled, IconLogin, IconWorld } from '@tabler/icons-react'
import { NavLink, Outlet, useNavigate, useNavigationType } from 'react-router';

export default function Shell(): React.ReactElement {
    const navigate = useNavigate()
    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Container size="xl" h="100%">
                    <Flex h="100%" justify="space-between" align="center">
                        <Group gap={0}>
                            <Button variant="transparent" component={Title} onClick={() => navigate("/")}>Inter-Knot</Button>
                            <Text c="dimmed" size="lg" fw={500}>β</Text>
                        </Group>
                        <Group gap="xs">
                            <Button leftSection={<IconWorld />}>Language</Button>
                            <ActionIcon><IconBrandPatreonFilled /></ActionIcon>
                            <ActionIcon><IconBrandDiscordFilled /></ActionIcon>
                            <Button leftSection={<IconLogin />}>Log in</Button>
                        </Group>
                    </Flex>
                </Container>
            </AppShell.Header>

            <AppShell.Main>
                <Container size="xl">
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}