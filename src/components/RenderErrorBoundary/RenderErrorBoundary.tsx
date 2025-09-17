import { Center, Alert, Stack, Group, Button, Text, Loader, Title } from "@mantine/core"
import { IconInfoCircle, IconCopy, IconBrandDiscordFilled } from "@tabler/icons-react"
import { ErrorBoundary } from "react-error-boundary"
import "./RenderErrorBoundary.css"
import { ErrorInfo, useState } from "react"

export default function RenderErrorBoundary({ children }: { children: React.ReactElement }): React.ReactElement {
    const [error, setError] = useState<Error | null>(null)
    const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)
    return <ErrorBoundary 
        onError={(error, info) => {
            setError(error)
            setErrorInfo(info)
        }}
        fallbackRender={() => {
            return <Center w="100vw" h="100vh">
                <Alert className="err-boundary-alert" title={`A rendering error has occurred!`} color="red" icon={<IconInfoCircle size={16} />}>
                    {!error || !errorInfo && 
                        <Group>
                            <Loader />
                            <Title>Collecting error information...</Title>
                        </Group>
                    }
                    {error && errorInfo &&
                        <Stack gap="xs">
                            <Text fw={800} fz={24}>{error.message}</Text>
                            <Stack gap="0">
                                {errorInfo.componentStack && errorInfo.componentStack.split("\n").map((line, index) => (
                                    <Text key={index} fz={12} c="gray.5" ff="monospace">{line}</Text>
                                ))}
                            </Stack>
                            <Text>Please, report this error to developers.</Text>
                            <Group grow>
                                <Button leftSection={<IconCopy />} variant="subtle"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(JSON.stringify({
                                            error: error.message,
                                            stack: error.stack?.split("\n"),
                                            componentStack: errorInfo.componentStack?.split("\n"),
                                            userAgent: navigator.userAgent,
                                            url: window.location.href,
                                        }))
                                        alert("Error message copied to clipboard")
                                    }}>
                                    Copy error message
                                </Button>
                                <Button leftSection={<IconBrandDiscordFilled />} variant="subtle"
                                    component="a" href="https://discord.gg/hFNheySRQD" target="_blank">
                                        Join our Discord server
                                </Button>
                            </Group>
                        </Stack>
                    }
                </Alert>
            </Center>
        }}>
        {children}
    </ErrorBoundary>
}