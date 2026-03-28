import { ActionIcon, AppShell, Button, Container, Flex, Group, Title, Text, Image, Anchor, Tabs, Modal, Stack, Burger, NavLink, useMantineTheme, Tooltip, Alert, Avatar, Divider } from '@mantine/core'
import { IconBrandDiscordFilled, IconBrandGithubFilled, IconBrandPatreonFilled, IconClearAll, IconInputX, IconLogin, IconSettings, IconStarFilled, IconTrophyFilled, IconUsers, IconX } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { ProfileInfo } from "@interknot/types"
import "./Shell.css"
import enkaImg from "@assets/Enka.svg"
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import InterknotLogo from "@icons/Interknot"
import { useContextMenu } from 'mantine-contextmenu'
import { getDiscordAuthUrl } from '@/api/discord'
import AccountButton from '../AccountButton/AccountButton'
import { doroMode } from '@/api/doro'


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

    useEffect(() => {
        const onboarding = localStorage.getItem("first-time")
        if (!onboarding) {
            open()
        }
    })

    const [navBarOpened, { toggle }] = useDisclosure(false)
    const [loginModalOpened, { open: openLoginModal, close: closeLoginModal }] = useDisclosure(false)

    const [creditsModalOpened, { open: openCreditsModal, close: closeCreditsModal }] = useDisclosure(false)

    return (<>
        <Modal opened={loginModalOpened} onClose={closeLoginModal}
            withCloseButton={true}
            closeOnClickOutside={true}
            closeOnEscape={true} centered
            data-nosnippet title="Log in">
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

        <Modal.Root opened={creditsModalOpened} onClose={closeCreditsModal}
            closeOnClickOutside={true}
            closeOnEscape={true} centered size="xl" data-nosnippet>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Group justify="space-between" w="100%" mr="md">
                        <Group>
                            <InterknotLogo height={48} />
                            <Title order={2}>Inter-Knot</Title>
                        </Group>
                        <Text inline fs="italic">Zenless Zone Zero leaderboards project</Text>
                    </Group>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <Stack gap="xl" mt="xl">
                        <Group w="100%" justify="center">
                            <Avatar src="https://avatars.githubusercontent.com/u/42270214" alt="Lily Stilson" size="lg" />
                            <Stack gap="0">
                                <Anchor href="https://github.com/LilyStilson" target="_blank" c="gray">
                                    <Title order={2}>Lily Stilson</Title>
                                </Anchor>
                                <Text c="dimmed" fz="lg">Main developer and maintainer</Text>
                            </Stack>
                        </Group>
                        <Divider w="100%" />
                        <Flex gap="xl" wrap="wrap" justify="center">
                            <Group maw="50%" wrap="nowrap">
                                <Avatar src="https://avatars.githubusercontent.com/u/55695564" alt="Eil RoviSoft" size="lg" />
                                <Stack gap="0">
                                    <Anchor href="https://github.com/EilRoviSoft" target="_blank" c="gray">
                                        <Title order={3}>Eil RoviSoft</Title>
                                    </Anchor>
                                    <Text c="dimmed">Technical support, backend provider and initial DMG Calculator design</Text>
                                </Stack>
                            </Group>

                            <Group>
                                <Avatar src="https://cdn.discordapp.com/avatars/591202875539980289/e078dee4b57e25f7d29bc0f1dc7ec93b.webp?size=256" alt="Fresh Sun" size="lg" />
                                <Stack gap="0">
                                    <Anchor href="/profile/1500008141" target="_blank" c="gray" onClick={(e) => {
                                        e.preventDefault()
                                        closeCreditsModal()
                                        navigate("/profile/1500008141")
                                    }}>
                                        <Title order={3}>Fresh Sun</Title>
                                    </Anchor>
                                    <Text c="dimmed">Moral support, Discord server keeper</Text>
                                </Stack>
                            </Group>

                            <Group>
                                <Avatar src="https://cdn.interknot.space/aprilfools/ui/zzz/IconRoleCircle49.png" alt="HuLiNa" size="lg" />
                                <Stack gap="0">
                                    <Anchor href="https://drive.google.com/drive/folders/1WACFDi3Azj_Cvivv5-kUQBYIkFiJo0GE" target="_blank" c="gray">
                                        <Title order={3}>HuLiNa</Title>
                                    </Anchor>
                                    <Text c="dimmed">Doro artwork</Text>
                                </Stack>
                            </Group>
                            {/* <Stack align="center" gap="xs">
                                    <Title order={3}>Developed and maintained by</Title>
                                    <Button variant="light" size="xl" px="0" pr="lg" color="blue"
                                        component="a" href="" target="_blank"
                                        leftSection={}>
                                        <Title order={3}>Lily Stilson</Title>
                                    </Button>
                                </Stack>
                                <Flex gap="xl" mt="md" justify="space-evenly">
                                    <Stack align="center" gap="xs">
                                        <Title order={5}>Technical support</Title>
                                        <Button variant="light" size="md" px="0" pr="lg" color="blue"
                                            component="a" href="" target="_blank"
                                            leftSection={<Avatar src="https://avatars.githubusercontent.com/u/55695564" alt="Eil RoviSoft" size="md" />}>
                                            <Title order={5}>EilRoviSoft</Title>
                                        </Button>
                                    </Stack>

                                    <Stack align="center" gap="xs">
                                        <Title order={5}>Moral support</Title>
                                        <Button variant="light" size="md" px="0" pr="lg" color="blue"
                                            component="a" href="" target="_blank"
                                            leftSection={<Avatar src="https://enka.network/ui/zzz/IconInterKnotRole0020.png" alt="Fresh Sun" size="md" />}>
                                            <Title order={5}>Fresh Sun</Title>
                                        </Button>
                                    </Stack>

                                    <Stack align="center" gap="xs">
                                        <Title order={5}>Doro Artwork</Title>
                                        <Button variant="light" size="md" px="0" pr="lg" color="blue"
                                            component="a" href="" target="_blank"
                                            leftSection={<Avatar src="https://cdn.interknot.space/aprilfools/ui/zzz/IconRoleCircle49.png" alt="HuLiNa" size="md" />}>
                                            <Title order={5}>HuLiNa</Title>
                                        </Button>
                                    </Stack> 

                                </Flex>*/}
                        </Flex>
                        <Divider />
                        <Stack align="center" gap="xs">
                            <Title order={2} mb="md">Special thanks to</Title>
                            <Flex gap="xl" wrap="wrap" justify="center">
                                <Group maw="50%" wrap="nowrap">
                                    <Avatar src="https://cdn.enka.network/avatars/9f1dce829b2bf1192a4623eff954d9d4/3c907032fd8d9abc114cb2d108839358.png" alt="Algoinde" size="lg" />
                                    <Stack gap="0">
                                        <Anchor href="https://enka.network/u/Algoinde" target="_blank" c="gray">
                                            <Title order={3}>Algoinde</Title>
                                        </Anchor>
                                        <Text c="dimmed">Enka.Network, technical support</Text>
                                    </Stack>
                                </Group>

                                <Group maw="50%" wrap="nowrap">
                                    <Avatar src="https://cdn.discordapp.com/avatars/445184256914751488/061b8ddc00616a86574405fb44ec3129.webp?size=128" alt="Soh" size="lg" />
                                    <Stack gap="0">
                                        <Title order={3}>Soh</Title>
                                        <Text c="dimmed">DMG Calculation verification</Text>
                                    </Stack>
                                </Group>
                            </Flex>
                        </Stack>
                        <Divider />
                        <Text fs="italic" ta="center">Welcome to New Eridu - where humanity rises anew!</Text>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>

        <AppShell header={{ height: 60 }} aside={{
            width: 500,
            breakpoint: "md",
            collapsed: { desktop: true, mobile: !navBarOpened }
        }} padding="md">
            <AppShell.Header>
                <Container size="1600px" h="100%">
                    <Flex h="100%" justify="space-between" align="center">
                        <Group gap="0px" wrap="nowrap">
                            <Button variant="transparent" component="a" href="/" onClick={(evt) => {
                                evt.preventDefault()
                                navigate("/")
                            }}><Group gap="8px" wrap="nowrap">
                                    <InterknotLogo height="38px" />
                                    <Title>Inter-Knot</Title>
                                </Group>
                            </Button>
                            <Text c="dimmed" size="lg" fw={500}>β</Text>
                            <Group ml="md" className="header-buttons" gap="xs">
                                <Button size="xs"
                                    component="a" href="/leaderboards"
                                    variant={location.pathname.includes("leaderboards") ? "filled" : "subtle"}
                                    onClick={(evt) => {
                                        evt.preventDefault()
                                        navigate("/leaderboards")
                                    }}>Leaderboards</Button>
                                <Button size="xs"
                                    component="a" href="/builds"
                                    variant={location.pathname.includes("builds") ? "filled" : "subtle"}
                                    onClick={(evt) => {
                                        evt.preventDefault()
                                        navigate("/builds")
                                    }}>Builds</Button>
                            </Group>
                        </Group>
                        <Burger opened={navBarOpened} onClick={toggle} hiddenFrom="md" size="sm" />
                        <Group className="header-buttons" gap="xs">
                            <Button leftSection={<IconSettings />} onClick={() => navigate("/settings")}>Settings</Button>
                            <ActionIcon disabled><IconBrandPatreonFilled /></ActionIcon>
                            <ActionIcon component="a" href="https://discord.gg/hFNheySRQD" target="_blank"><IconBrandDiscordFilled /></ActionIcon>
                            <ActionIcon component="a" href="https://github.com/Night-Sky-Studio/interknot" target="_blank"><IconBrandGithubFilled /></ActionIcon>
                            <AccountButton loginClick={openLoginModal} />
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
                <NavLink label="Builds" leftSection={<IconUsers />}
                    variant="filled"
                    autoContrast
                    active={location.pathname.includes("builds")}
                    onClick={() => {
                        navigate("/builds")
                        toggle()
                    }} />
                <NavLink label="Log in" leftSection={<IconLogin />} onClick={() => {
                    openLoginModal()
                    toggle()
                }} />
                <NavLink label="Settings" leftSection={<IconSettings />} onClick={() => {
                    navigate("/settings")
                    toggle()
                }} />

                {users.length !== 0 && <>
                    <Title m="sm" order={4}>Users</Title>
                    {
                        users.map(u => <NavLink key={u.Uid} label={u.Nickname}
                            variant="filled"
                            autoContrast
                            leftSection={favoriteUsers.includes(u.Uid) ? <IconStarFilled size="16px" /> : undefined}
                            active={`${u.Uid}` === selectedUser}
                            onClick={() => {
                                navigate(`/profile/${u.Uid}`)
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
                    {
                        doroMode() && <Alert variant="light" color="blue" mb="md"
                            title="A Doro invasion has begun!"
                            icon={<Image src="https://cdn.interknot.space/aprilfools/vivian_doro_rocket.gif"
                                alt="doro" w={32} h={32} />} data-nosnippet>
                            <Text>A weird creature from another world has taken over the Inter-Knot!</Text>
                            <Text>Don't worry, our team of experts is working hard to contain the situation and restore everything back.
                                In the meantime, feel free to explore the site and enjoy the chaos!</Text>
                        </Alert>
                    }
                    {users.length !== 0 &&
                        <Tabs value={selectedUser} onChange={(value) => {
                            navigate(`/profile/${value}`)
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
                    <Flex justify="space-evenly" align="center" wrap="wrap">
                        <Anchor href="https://enka.network" target="_blank">
                            <Image src={enkaImg} alt="Powered by Enka.Network" w={256} />
                        </Anchor>
                        {/* <Anchor href="https://github.com/Night-Sky-Studio" target="_blank">
                            <Image src={nssImg} alt="Developed by Night Sky Studio" w={256} />
                        </Anchor> */}
                        <Text fs="italic">Welcome to New Eridu - where humanity rises anew!</Text>
                        <Stack gap="0" align="end" w={256}>
                            <Anchor c="dimmed">Privacy Policy</Anchor>
                            <Anchor c="dimmed" onClick={openCreditsModal}>Credits</Anchor>
                        </Stack>
                    </Flex>
                </Container>
            </AppShell.Footer>
        </AppShell>
    </>)
}