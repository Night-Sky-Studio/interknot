import { useAsync } from "react-use"
import { getNews } from "../api/data"
import { Card, Center, Text, Loader, Title, Stack, Flex, Avatar, Group, Anchor, Image, Code, List, Modal, Button, BackgroundImage } from "@mantine/core"
import { memo, useState } from "react"
import { BelleMessage } from "@interknot/types"
import Markdown from "react-markdown"
import "./styles/NewsFeed.css"
import { useDisclosure } from "@mantine/hooks"
import { IconBrandDiscordFilled } from "@tabler/icons-react"
import { useNavigate } from "react-router"

function Message({ msg }: { msg: BelleMessage }) {
    const [opened, { open, close }] = useDisclosure(false)
    const [clickedImageUrl, setClickedImageUrl] = useState<string | null>(null)
    const navigate = useNavigate()

    return (<>
        <Modal.Root opened={opened} onClose={close} centered size="100%"
            transitionProps={{ transition: "pop" }}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Body p="0">
                    <Image h="auto" w="100%" src={clickedImageUrl ?? ""} alt="Clicked" radius="md" />
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>

        <Card className="discord-msg" mb="md">
            <Flex gap="md">
                <Avatar src={msg.Author.Avatar} alt={msg.Author.Username} radius="xl" />
                <Stack gap="sm" mr="md">
                    <Group>
                        <Anchor href="/user/1500438496" target="_blank"
                            onClick={(evt) => {
                                evt.preventDefault()
                                navigate("/user/1500438496")
                            }} fw={500}>
                            { msg.Author.GlobalName }
                        </Anchor>
                        <Text c="dimmed" size="xs">{new Date(msg.CreatedAt).toUTCString()}</Text>
                    </Group>
                    <Markdown components={{
                        a: ({ node, ...props }) => <Anchor {...props} />,
                        h1: ({ node, ...props }) => <Title c="white" order={3} {...props} />,
                        h2: ({ node, ...props }) => <Title c="white" order={4} {...props} />,
                        h3: ({ node, ...props }) => <Title c="white" order={5} {...props} />,
                        h4: ({ node, ...props }) => <Title c="white" order={6} {...props} />,
                        h5: ({ node, ...props }) => <Title c="white" order={6} {...props} />,
                        h6: ({ node, ...props }) => <Title c="white" order={6} {...props} />,
                        p: ({ node, ...props }) => <Text c="white" {...props} />,
                        img: ({ node, ...props }) => <Image {...props} />,
                        code: ({ node, ...props }) => <Code {...props} />,
                        ul: ({ node, ...props }) => <List ml="md" {...props} />,
                        li: ({ node, ...props }) => <List.Item c="white" {...props} />
                    }}>
                        { msg.CleanContent.replace("@everyone", "").trim() }
                    </Markdown>
                    <Group>
                        {
                            msg.Attachments.map((attachment, index) => 
                                <Image key={index} h="auto" w="640px" mah="256px" maw="100%" 
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setClickedImageUrl(attachment.Url)
                                        open()
                                    }} src={attachment.Url} alt={attachment.Id} radius="md" />
                            )
                        }
                    </Group>
                </Stack>
            </Flex>
        </Card>
    </>)
}

export default function NewsFeed() {
    const { value: news, loading, error } = useAsync(getNews, [])

    return (
        <BackgroundImage radius="sm"
            src="https://enka.network/img/zzz_backdrop.jpg">
            <Card className="news-feed" bg="rgba(0 0 0 / 0.5)" style={{ backdropFilter: "blur(4px)" }} shadow="md">
                <Card.Section pb="md" m="sm" style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <Group justify="space-between" align="center">
                        <Group align="center">
                            <Title order={2} pr="md" c="white" style={{ borderRight: "1px solid #e0e0e0" }}>News</Title>
                            <Text c="dimmed" size="sm">fetched via Discord</Text>
                        </Group>
                        <Button component="a" variant="subtle" leftSection={<IconBrandDiscordFilled />} 
                            href="https://discord.gg/hFNheySRQD" target="_blank">Discord</Button>
                    </Group>
                </Card.Section>
                <Card.Section h="720px" style={{ overflowY: "auto" }}>
                    {
                        loading && <Center><Loader /></Center>
                    }
                    {
                        news && <Stack ml="lg" mr="md" gap="0">
                            {
                                news.map(msg => <Message key={msg.Id} msg={msg} />)
                            }
                        </Stack>
                    }
                    {
                        error && <div>Error loading news: {error.message}</div>
                    }
                </Card.Section>
            </Card>
        </BackgroundImage>
    )
}

export const NewsFeedMemoized = memo(NewsFeed)