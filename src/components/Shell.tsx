import { ActionIcon, AppShell, Button, Container, Flex, Group, Title, Text, Image, Anchor, SimpleGrid, Center, Tabs, FloatingIndicator, ScrollArea } from '@mantine/core'
import { IconBrandDiscordFilled, IconBrandPatreonFilled, IconLogin, IconWorld } from '@tabler/icons-react'
import { Outlet, useNavigate, useParams } from 'react-router'
import Users from '../mock/MockUsers'
import { useEffect, useState } from 'react'
import "./styles/Shell.pcss"

export default function Shell(): React.ReactElement {
    const navigate = useNavigate()
    const params = useParams()

    const [users, setUsers] = useState(Users)
    const [selectedUser, setSelectedUser] = useState(params.id ?? "")

    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
    const [controlRefs, setControlRefs] = useState<Record<string, HTMLButtonElement | null>>({})
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlRefs[val] = node
        setControlRefs(controlRefs)
    }

    useEffect(() => {
        setSelectedUser(params.id ?? "")
    }, [params])

    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Container size="xl" h="100%">
                    <Flex h="100%" justify="space-between" align="center">
                        <Group gap={0}>
                            <Button variant="transparent" component={Title} onClick={() => {
                                setSelectedUser("")
                                navigate("/")
                            }}>Inter-Knot</Button>
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
                    <Tabs value={selectedUser} onChange={(value) => {
                        setSelectedUser(value ?? "")
                        navigate(`/user/${value}`)
                    }} variant="none">
                        <Tabs.List ref={setRootRef} className="list">
                            {
                                users.map(user => {
                                    let profile = user.PlayerInfo.SocialDetail.ProfileDetail 
                                    return <Tabs.Tab key={profile.Uid} 
                                        value={profile.Uid.toString()}
                                        ref={setControlRef(profile.Uid.toString())}
                                        className="tab">
                                        {profile.Nickname}
                                    </Tabs.Tab>
                                })
                            }

                            <FloatingIndicator target={selectedUser ? controlRefs[selectedUser] : null}
                                parent={rootRef} className="indicator" />
                        </Tabs.List>
                    </Tabs>
                    <Outlet />
                </Container>
            </AppShell.Main>

            <AppShell.Footer pos="relative">
                <Container size="lg" h="100%">
                    <Flex justify="space-between" align="center" wrap="wrap">
                        <Anchor href="https://enka.network" target="_blank">
                            <Image src="/assets/Enka.svg" alt="Powered by Enka.Network" w={256} />
                        </Anchor>
                        <Anchor href="https://github.com/Night-Sky-Studio" target="_blank">
                            <Image src="/assets/nss.svg" alt="Developed by Night Sky Studio" w={256} />
                        </Anchor>
                        <Text fs="italic" m="lg">Welcome to New Eridu - where humanity rises anew!</Text>
                    </Flex>
                </Container>
            </AppShell.Footer>
        </AppShell>
    );
}