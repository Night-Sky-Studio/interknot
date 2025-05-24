import { Group, Stack, Loader, Title, Center, Text } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParam } from 'react-use'
import { authenticateDiscord } from '../../api/auth'
// import { useAuth } from '../../components/AuthProvider'
import { IconCheck } from '@tabler/icons-react'
import { Account } from '@interknot/types'

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
                    {(loading ?? true) && <Loader />}
                    {(success ?? false) && <IconCheck />}
                    <Title order={3}>{title}</Title>
                </Group>
                {children}
            </Stack>
        </Center>
    )
}

const DiscordAuthCallback = () => {
    const navigate = useNavigate()

    // const { account } = useAuth()

    const code = useSearchParam("code")

    const [status, setStatus] = useState("Authenticating you with Discord...")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [userData, setUserData] = useState<Account | null>(null)
    const [success, setSuccess] = useState(false)

    const authAttemptedRef = useRef(false)

    useEffect(() => {
        if (code && !authAttemptedRef.current) {
            authAttemptedRef.current = true
            setLoading(true)
            
            authenticateDiscord(code)
                .then(data => {
                    setSuccess(true)
                    setUserData(data)
                })
                .catch(err => {
                    setError(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [code])

    useEffect(() => {
        if (error) {
            setStatus("Authentication failed, redirecting you back...")
            setTimeout(() => {
                navigate("/")
            }, REDIRECT_TIMEOUT)
            return;
        }
        
        if (userData) {
            setStatus("Authenticated successfully, redirecting you back...")
            setTimeout(() => {
                navigate("/")
            }, REDIRECT_TIMEOUT)
            return;
        }
    }, [userData, error, navigate])

    return (
        <AuthCallback loading={loading} success={success} title={status}>
            {error && <Text>Authentication failed. Reason: {error.message}</Text>}
        </AuthCallback>
    )
}

AuthCallback.Discord = DiscordAuthCallback

export default AuthCallback