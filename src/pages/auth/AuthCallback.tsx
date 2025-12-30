import { authenticateDiscord } from "@/api/auth"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Account } from "@interknot/types"
import { Center, Group, Stack, Loader, Title, Text } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"

const REDIRECT_TIMEOUT = 5 * 1000

interface IAuthCallbackProps {
    title: string
    success?: boolean
    loading?: boolean
    children?: React.ReactNode
}

const AuthCallback = ({ title, success, loading, children }: IAuthCallbackProps) => {
    return (
        <Center>
            <Stack>
                <Group>
                    { (loading ?? true) && <Loader />}
                    { (success ?? false) && <IconCheck /> }
                    <Title order={3}>{title}</Title>
                </Group>
                { children }
            </Stack>
        </Center>
    )
}

const DiscordAuthCallback = () => {
    const navigate = useNavigate()

    const [{ code }] = useQueryParams()

    const [status, setStatus] = useState("Authenticating you with Discord...")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [userData, setUserData] = useState<Account | undefined>(undefined)
    const [success, setSuccess] = useState(false)

    const authAttemptedRef = useRef(false)
    
    useEffect(() => {
        if (code && !authAttemptedRef.current) {
            authAttemptedRef.current = true
            setLoading(true)

            authenticateDiscord(code as string)
                .then((account) => {
                    setSuccess(true)
                    setError(null)
                    setUserData(account.data)
                })
                .catch((err) => {
                    console.error(err)
                    setError(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setError(new Error("No code provided"))
        }
    }, [code])

    useEffect(() => {
        if (loading) {
            return
        }

        if (userData) {
            setStatus("Authenticated successfully, redirecting you back...")
            setTimeout(() => {
                navigate("/")
                window.location.reload()
            }, REDIRECT_TIMEOUT)
            return
        }

        if (error) {
            setStatus("Authentication failed, redirecting you back...")
            setTimeout(() => {
                navigate("/")
            }, REDIRECT_TIMEOUT)
            return
        }
    }, [userData, error, loading, navigate])

    return (
        <AuthCallback loading={loading} success={success} title={status}>
            { error && <Text>Authentication failed. Reason: {error.message}</Text>}
        </AuthCallback>
    )
}

AuthCallback.Discord = DiscordAuthCallback

export default AuthCallback