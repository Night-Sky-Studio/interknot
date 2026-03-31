import policy from "@assets/PRIVACY.md?raw"
import { MantineMd } from "@components/MantineMd.tsx"
import { Card, Container } from "@mantine/core"

export function PrivacyPage() {
    return (
        <Container size="xl">
            <Card>
                <MantineMd size="full">
                    { policy }
                </MantineMd>
            </Card>
        </Container>
    )
}