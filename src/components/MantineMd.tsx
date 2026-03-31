import Markdown, { Options } from "react-markdown"
import { Anchor, Code, Divider, Image, List, Text, Title } from "@mantine/core"

interface IMantineMdProps {
    children?: string | null,
    options?: Options
    size?: "full" | "compact"
}

export function MantineMd({ children, options, size }: IMantineMdProps) {
    size = size ?? "compact"
    return (
        <Markdown components={{
            a: ({ node, ...props }) => <Anchor {...props} />,
            h1: ({ node, ...props }) =>
                <Title c="white" order={size === "compact" ? 3 : 1} {...props} />,
            h2: ({ node, ...props }) =>
                <Title c="white" order={size === "compact" ? 4 : 2} {...props} />,
            h3: ({ node, ...props }) =>
                <Title c="white" order={size === "compact" ? 5 : 3} {...props} />,
            h4: ({ node, ...props }) =>
                <Title c="white" order={size === "compact" ? 6 : 4} {...props} />,
            h5: ({ node, ...props }) =>
                <Title c="white" order={size === "compact" ? 6 : 5} {...props} />,
            h6: ({ node, ...props }) =>
                <Title c="white" order={size === "compact" ? 6 : 6} {...props} />,
            p: ({ node, ...props }) => <Text c="white" {...props} />,
            img: ({ node, ...props }) => <Image {...props} />,
            code: ({ node, ...props }) => <Code {...props} />,
            ul: ({ node, ...props }) => <List ml="md" {...props} />,
            li: ({ node, ...props }) => <List.Item c="white" {...props} />,
            hr: ({ node, ...props }) => <Divider c="white" my="md" {...props} />
        }} {...options}>
            { children }
        </Markdown>
    )
}