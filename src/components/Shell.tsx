import { ActionIcon, AppShell, Button, Container, Flex, Group, Title, Text, Image, Anchor, Tabs, FloatingIndicator, Modal, Center, Stack, Grid } from '@mantine/core'
import { IconBrandDiscordFilled, IconBrandPatreonFilled, IconLogin, IconWorld } from '@tabler/icons-react'
import { Outlet, useNavigate, useParams } from 'react-router'
import Users from '../mock/MockUsers'
import { useEffect, useState } from 'react'
import "./styles/Shell.pcss"
import enkaImg from "../../assets/Enka.svg"
import nssImg from "../../assets/nss.svg"
import { useDisclosure } from '@mantine/hooks'
import grace from "../../assets/grace.webp"

export default function Shell(): React.ReactElement {
    const navigate = useNavigate()
    const params = useParams()

    const [users, _] = useState(Users)
    const [selectedUser, setSelectedUser] = useState(params.id ?? "")

    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
    const [controlRefs, setControlRefs] = useState<Record<string, HTMLButtonElement | null>>({})
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlRefs[val] = node
        setControlRefs(controlRefs)
    }

    const [opened, { open, close }] = useDisclosure(false)

    useEffect(() => {
        const onboarding = localStorage.getItem("first-time")
        if (!onboarding) {
            open()
        }
    })

    useEffect(() => {
        setSelectedUser(params.id ?? "")
    }, [params])

    return (<>
        <Modal opened={opened} onClose={close} withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} size="xl">
            <Grid grow columns={6}>
                <Grid.Col span={2}>
                    <Image src={grace} alt="Grace" />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Stack>
                        <Title>Early Access Notice</Title>
                        <Text>
                            Welcome to Inter-Knot, proxies! This is the place that we hope you will be able to use
                            to share builds of your agents. Currently, it's in <Text c="red.5" span>VERY EARLY</Text> beta stage
                            and basically nothing works yet. We are working non-stop on this project and we are
                            extremely excited for you all to use our platform in the future, so please be patient.
                        </Text>
                        <Text>
                            With that said, if you'd like to help, then don't hesitate contacting me on Discord 
                            <Text component="a" c="blue" href="https://discordapp.com/users/225471940826103810"> @lilystilson</Text>.
                            Any help is highly appreciated!
                        </Text>
                        <Text>Also, the only official sources of information is our Twitter page 
                            <Text component="a" c="blue" href="https://x.com/InterknotSpace"> @InterknotSpace</Text>. It's currently empty, 
                            but I'll try to post some updates there.</Text>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Center m="lg"><Button onClick={() => {
                localStorage.setItem("first-time", "true")
                close()
            }}>I understand, let me click some buttons!</Button></Center>
        </Modal>

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
                            <Image src={enkaImg} alt="Powered by Enka.Network" w={256} />
                        </Anchor>
                        <Anchor href="https://github.com/Night-Sky-Studio" target="_blank">
                            <Image src={nssImg} alt="Developed by Night Sky Studio" w={256} />
                        </Anchor>
                        <Text fs="italic" m="lg">Welcome to New Eridu - where humanity rises anew!</Text>
                    </Flex>
                </Container>
            </AppShell.Footer>
        </AppShell>
    </>)
}