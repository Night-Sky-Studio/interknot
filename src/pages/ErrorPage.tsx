import { Stack, Title, Text, Image } from "@mantine/core"
import "./styles/ErrorPage.css"

export default function ErrorPage(): React.ReactElement {
    return (
        <Stack justify="center" align="center">
            <Image className="img-wiggle" src="/assets/ellen_404.webp" alt="404" w={384} />
            <Title>Not found</Title>
            <Text size="xl">Sorry, the page you're looking for doesn't exist.</Text>
        </Stack>
    )
}