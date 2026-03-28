import { Text, Avatar, Button, Group, Modal, PolymorphicComponentProps, Stack, Title, Loader, type ButtonProps, UnstyledButton } from "@mantine/core"
// import { useData } from "@components/DataProvider"
import { IconBrandDiscordFilled, IconBrandPatreonFilled, IconLogin, IconLogout, IconUser } from "@tabler/icons-react"
import { useAuth } from "@components/AuthProvider"
import { useDisclosure } from "@mantine/hooks"
import { logout } from "@/api/auth"
import SupporterFlair from "../SupporterFlair/SupporterFlair"
import { UserHeaderMemoized } from "../UserHeader/UserHeader"
import { useNavigate } from "react-router"

interface ILoginButtonProps extends PolymorphicComponentProps<"button", ButtonProps> {
    loginClick?: () => void
}

export default function AccountButton({ loginClick, ...props }: ILoginButtonProps) {
    const { account, loading } = useAuth()

    const [opened, { open, close }] = useDisclosure(false)

    const navigate = useNavigate()

    return (<>
        <Modal.Root opened={opened} onClose={close}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Account settings</Modal.Title>
                    <Group>
                        <Button leftSection={<IconLogout />} onClick={async () => {
                            const result = await logout()
                            if (result.success) {
                                window.location.reload()
                            }
                        }}>Log out</Button>
                        <Modal.CloseButton />
                    </Group>
                </Modal.Header>
                <Modal.Body>
                    <Stack>
                        <Group align="center" gap="md">
                            <Avatar src={account?.ProfilePictureUrl} size={80} />
                            <Stack gap="0">
                                <Title order={2}>{account?.Username}</Title>
                                {
                                    account?.Provider === "discord"
                                        ? <Group gap="0.25rem">
                                            <IconBrandDiscordFilled />
                                            <Text c="dimmed">Discord</Text>
                                        </Group>
                                        : <Group gap="0.25rem">
                                            <IconBrandPatreonFilled />
                                            <Text c="dimmed">Patreon</Text>
                                        </Group>
                                }
                            </Stack>
                        </Group>
                        <Group justify="space-between">
                            <Group>
                                <IconBrandPatreonFilled />
                                <Text>Supporter status</Text>
                            </Group>
                            {account?.AccountLevel !== undefined && 
                                <SupporterFlair level={account.AccountLevel} />
                            }
                        </Group>
                        <Group justify="space-between">
                            <Group>
                                <IconUser />
                                <Text>Claimed profiles</Text>
                            </Group>
                            {
                                account?.ClaimedProfiles && account.ClaimedProfiles.length > 0
                                    ? <Text>{account.ClaimedProfiles.length}</Text>
                                    : <Text c="dimmed">None</Text>
                            }
                        </Group>
                        {
                            account?.ClaimedProfiles?.map((p) => 
                                <UnstyledButton key={p.Uid} className="profile-button"
                                    onClick={() => {
                                        close()
                                        navigate(`user/${p.Uid}`)
                                    }}>
                                    <UserHeaderMemoized user={p} variant="compact" />
                                </UnstyledButton>
                            ) ?? <Text c="dimmed">None</Text>
                        }
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
        {
            loading 
                ? <Loader /> 
                : account
                    ? <Button {...props} onClick={open} 
                        pl="4px" pr="md"
                        leftSection={
                            <Avatar src={account.ProfilePictureUrl} 
                                size="sm" style={{ outline: "1px solid black" }} />
                        }>
                        {account.Username}
                    </Button>
                    : <Button onClick={loginClick} leftSection={<IconLogin />}>Log in</Button>
        }
    </>)
}