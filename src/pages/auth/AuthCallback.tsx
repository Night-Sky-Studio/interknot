import { Group, Stack, Loader, Title, Center } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParam } from 'react-use'
import authenticateDiscord from '../../api/auth'
import { useAuth } from '../../components/AuthProvider'

interface IAuthCallbackProps {
    title: string
    isLoading?: boolean
    children?: React.ReactNode
}

const AuthCallback = ({ title, isLoading, children }: IAuthCallbackProps) => {
    return (
        <Center>
            <Stack>
                <Group>
                    {(isLoading ?? true) && <Loader />}
                    <Title order={3}>{title}</Title>
                </Group>
                {children}
            </Stack>
        </Center>
    )
}

const DiscordAuthCallback = () => {
    const navigate = useNavigate()

    const { saveAccount } = useAuth()

    const code = useSearchParam("code")

    const [isLoading, setIsLoading] = useState(true)
    const [status, setStatus] = useState("Authenticating you with Discord...")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!code) {
            setIsLoading(false)
            setStatus("Authentication failed, redirecting you back...")
            setError("Error: No auth code was found.")
            setTimeout(() => {
                navigate("/")
            }, 2000)
            return
        }

        authenticateDiscord(code)
            .then((result) => {
                saveAccount(result)
                setStatus("Authenticated successfully, redirecting you back...")
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            })
            .catch((err) => {
                console.error(err)
                setIsLoading(false)
                setStatus("Authentication failed, redirecting you back...")
                setError("Error: " + err.message)
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            })
    }, [code])

    return <AuthCallback isLoading={isLoading} title={status}>
        {error}
    </AuthCallback>
}

AuthCallback.Discord = DiscordAuthCallback

export default AuthCallback