import { ActionIcon, AppShell, Button, Container, Flex, Group, Title, Text, Image, Anchor, Tabs, Modal, Stack, Grid, Burger, NavLink, useMantineTheme, Tooltip } from '@mantine/core'
import { IconBrandDiscordFilled, IconBrandGithubFilled, IconBrandPatreonFilled, IconClearAll, IconInputX, IconLogin, IconSettings, IconStarFilled, IconTrophyFilled, IconX } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { ProfileInfo, url } from "@interknot/types"
import "./styles/Shell.pcss"
import enkaImg from "../../assets/Enka.svg"
import nssImg from "../../assets/nss.svg"
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import grace from "../../assets/grace.webp"
import InterknotLogo from "./icons/Interknot"
import { useContextMenu } from 'mantine-contextmenu'
import { getDiscordAuthUrl } from '../api/discord'

export default function Shell(): React.ReactElement {
    const theme = useMantineTheme()
    const { showContextMenu } = useContextMenu()

    const navigate = useNavigate()
    const location = useLocation()
    const { uid } = useParams()

    const [users, setSavedUsers] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [selectedUser, setSelectedUser] = useState(uid ?? "")
    const [favoriteUsers, setFavoriteUsers] = useLocalStorage<number[]>({ key: "favoriteUsers", defaultValue: [] })

    useEffect(() => {
        if (users.length > 0 && favoriteUsers.length > 0) {
            const currentUsers = [...users]
            const favUsers: ProfileInfo[] = []
            const nonFavUsers: ProfileInfo[] = []
            
            currentUsers.forEach(user => {
                if (favoriteUsers.includes(user.Uid)) {
                    favUsers.push(user)
                } else {
                    nonFavUsers.push(user)
                }
            })
            
            favUsers.sort((a, b) => 
                favoriteUsers.indexOf(a.Uid) - favoriteUsers.indexOf(b.Uid))
            
            setSavedUsers([...favUsers, ...nonFavUsers])
        }
    }, [favoriteUsers, users.length])

    useEffect(() => {
        setSelectedUser(uid ?? "")
    }, [uid])

    const [opened, { open, close }] = useDisclosure(false)

    useEffect(() => {
        const onboarding = localStorage.getItem("first-time")
        if (!onboarding) {
            open()
        }
    })

    const [navBarOpened, { toggle }] = useDisclosure(false)

    const [loginModalOpened, { open: openLoginModal, close: closeLoginModal }] = useDisclosure(false)

    return (<>
        <Modal opened={opened} onClose={close} withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} size="xl"
            data-nosnippet>
            <Grid grow columns={6}>
                <Grid.Col span={2}>
                    <Image src={grace} w="236px" h="100%" fit="contain" alt="Grace" />
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
                            With that said, if you'd like to help, then don't hesitate joining our Discord server and submitting
                            a bug report or suggesting a feature you'd like to see.
                            Any help is highly appreciated!
                        </Text>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Group m="lg" justify="center">
                <Button leftSection={<IconBrandDiscordFilled />} variant="subtle"
                    component="a" href="https://discord.gg/hFNheySRQD" target="_blank">
                        Join our Discord server
                </Button>
                <Button onClick={() => {
                    localStorage.setItem("first-time", "true")
                    close()
                }}>I understand, let me click some buttons!</Button>
            </Group>
        </Modal>

        <Modal opened={loginModalOpened} onClose={closeLoginModal} 
            withCloseButton={true} 
            closeOnClickOutside={true} 
            closeOnEscape={true} centered
            data-nosnippet title={<Title order={2}>Log in</Title>}>
            <Stack>
                <Text>Select authentication method</Text>
                <Group grow>
                    <ActionIcon component="a" variant="filled" h={96} color="#5865f2"
                        href={getDiscordAuthUrl()}>
                        <Stack gap="0" align="center">
                            <IconBrandDiscordFilled size="32px" />
                            <Title order={4}>Discord</Title>
                        </Stack>
                    </ActionIcon>
                    <Tooltip label="Coming soon!" position="top" withArrow>
                        <ActionIcon component="a" variant="subtle" h={96} disabled>
                            <Stack gap="0" align="center">
                                <IconBrandPatreonFilled size="32px" />
                                <Title order={4}>Patreon</Title>
                            </Stack>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Stack>
        </Modal>

        <AppShell header={{ height: 60 }} aside={{
            width: 500,
            breakpoint: "md",
            collapsed: { desktop: true, mobile: !navBarOpened }
        }} padding="md">
            <AppShell.Header>
                <Container size="1600px" h="100%">
                    <Flex h="100%" justify="space-between" align="center">
                        <Group gap={0} wrap="nowrap">
                            <Button variant="transparent" component={Title} onClick={() => {
                                navigate("/")
                            }}><Group gap="8px" wrap="nowrap">
                                <InterknotLogo height="38px" /> 
                                Inter-Knot
                                </Group>
                            </Button>
                            <Text c="dimmed" size="lg" fw={500}>β</Text>
                            <Group ml="md" className="header-buttons">
                                <Button size="xs"
                                    variant={location.pathname.includes("leaderboards") ? "filled" : "subtle"} 
                                    onClick={() => {
                                        navigate("/leaderboards")
                                    }}>Leaderboards</Button>
                            </Group>
                        </Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
                        <Group className="header-buttons"  gap="xs">
                            <Button leftSection={<IconSettings />} onClick={() => navigate("/settings")}>Settings</Button>
                            <ActionIcon><IconBrandPatreonFilled /></ActionIcon>
                            <ActionIcon component="a" href="https://discord.gg/hFNheySRQD" target="_blank"><IconBrandDiscordFilled /></ActionIcon>
                            <ActionIcon component="a" href="https://github.com/Night-Sky-Studio/interknot" target="_blank"><IconBrandGithubFilled /></ActionIcon>
                            <Button leftSection={<IconLogin />} onClick={openLoginModal}>Log in</Button>
                        </Group>
                    </Flex>
                </Container>
            </AppShell.Header>
            
            <AppShell.Aside>
                <NavLink label="Leaderboards" leftSection={<IconTrophyFilled />}
                    variant="filled" 
                    autoContrast
                    active={location.pathname.includes("leaderboards")}
                    onClick={() => {
                        navigate("/leaderboards")
                        toggle()
                    }} />
                <NavLink label="Log in" leftSection={<IconLogin />} onClick={openLoginModal} />
                <NavLink label="Settings" leftSection={<IconSettings />} onClick={() => {
                    navigate("/settings")
                    toggle()
                }} />
                
                { users.length !== 0 && <>
                    <Title m="sm" order={4}>Users</Title>
                    {
                        users.map(u => <NavLink key={u.Uid} label={u.Nickname}
                            variant="filled"
                            autoContrast
                            leftSection={favoriteUsers.includes(u.Uid) ? <IconStarFilled size="16px" /> : undefined}
                            active={`${u.Uid}` === selectedUser}
                            onClick={() => { 
                                navigate(`/user/${u.Uid}`)
                                toggle()
                            }} />)
                    }       
                    </>
                }
                
                <Title m="sm" order={4}>Links</Title>
                <NavLink label="Patreon" variant="filled" leftSection={<IconBrandPatreonFilled />} />
                <NavLink label="Discord" leftSection={<IconBrandDiscordFilled />} href="https://discord.gg/hFNheySRQD" target="_blank" />
                <NavLink label="GitHub" leftSection={<IconBrandGithubFilled />} href="https://github.com/Night-Sky-Studio/interknot" target="_blank" />
            </AppShell.Aside>

            <AppShell.Main>
                <Container size="1600px">
                    {users.length !== 0 &&
                        <Tabs value={selectedUser} onChange={(value) => {
                            navigate(`/user/${value}`)
                        }} variant="pills" mb="md" onContextMenu={showContextMenu([
                            {
                                key: "closeAll",
                                icon: <IconClearAll />,
                                title: "Close all",
                                onClick: () => {
                                    setSavedUsers([])
                                    setFavoriteUsers([])
                                }
                            },
                            {
                                key: "closeAllUnfavorite",
                                icon: <IconInputX />,
                                title: "Close all unfavorite",
                                onClick: () => {
                                    setSavedUsers(users.filter(u => favoriteUsers.includes(u.Uid)))
                                }
                            }
                        ])}>    
                            <Tabs.List className="list" >
                                {
                                    users.map(user => {
                                        if ((user as any).Characters !== undefined) {
                                            setSavedUsers([])
                                            return
                                        }
                                        return <Tabs.Tab key={user.Uid} component="div"
                                            value={user.Uid.toString()}
                                            className="tab"
                                            leftSection={
                                                favoriteUsers.includes(user.Uid) 
                                                    ? <IconStarFilled size="20px" color={theme.colors["zzz"][0]} /> 
                                                    : undefined
                                            }
                                            rightSection={
                                                <ActionIcon variant="transparent" onClick={(event) => {
                                                    event.stopPropagation()
                                                    setSavedUsers(users.filter(u => u.Uid !== user.Uid))
                                                    setFavoriteUsers(favoriteUsers.filter(f => f !== user.Uid))
                                                }}>
                                                    <IconX size="20px" />
                                                </ActionIcon>
                                            }>
                                            {user.Nickname}
                                        </Tabs.Tab>
                                    })
                                }
                            </Tabs.List>
                        </Tabs>
                    }
                    <Outlet />
                </Container>
            </AppShell.Main>

            <AppShell.Footer pos="relative" p="sm">
                <Container size="lg" h="100%">
                    <Flex justify="center" gap="xl" align="center" wrap="wrap">
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