import { Center, Alert, Stack, Group, Button, Text } from "@mantine/core"
import { IconInfoCircle, IconCopy, IconBrandDiscordFilled } from "@tabler/icons-react"
import { ErrorBoundary } from "react-error-boundary"
import "./styles/RenderErrorBoundary.css"

export default function RenderErrorBoundary({ children }: { children: React.ReactElement }): React.ReactElement {
    return <ErrorBoundary fallbackRender={({ error }: { error: Error }) => {
        return <Center w="100vw" h="100vh">
            <Alert className="err-boundary-alert" title={`A rendering error has occurred!`} color="red" icon={<IconInfoCircle size={16} />}>
                <Stack gap="xs">
                    <Text fw={800} fz={24}>{error.message}</Text>
                    <Stack gap="0">
                        {error.stack && error.stack.split("\n").map((line, index) => (
                            <Text key={index} fz={12} c="gray.5" ff="monospace">{line}</Text>
                        ))}
                    </Stack>
                    <Text>Please, report this error to developers.</Text>
                    <Group grow>
                        <Button leftSection={<IconCopy />} variant="subtle"
                            onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify({
                                    message: error.message,
                                    stack: error.stack,
                                    name: error.name,
                                    cause: error.cause,
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
            </Alert>
        </Center>
    }}>
        {children}
    </ErrorBoundary>
}