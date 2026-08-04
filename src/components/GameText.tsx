import { useMemo } from "react"
import { Stack, Text } from "@mantine/core"
import { getTerm } from "@/localization/Localization";
import { GetLocalStringFunc, useSettings } from "./SettingsProvider";

export interface IGameTextProps {
    text: string
    size?: string
    /** Spacing between paragraphs. */
    gap?: string
}

interface TextNode {
    type: "text"
    value: string
}

interface ElementNode {
    type: "element"
    tag: string
    /** Tag argument, i.e. `#2BAD00` in `<color=#2BAD00>` or `2000004` in `<Term:2000004>`. */
    value?: string
    children: GameNode[]
}

type GameNode = TextNode | ElementNode

/** A paragraph is a top-level line of the source text. */
type Paragraph = GameNode[]

interface Tag {
    closing: boolean
    name: string
    value?: string
    /** Index right after the closing `>`. */
    end: number
}

function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z")
}

function isHexDigit(char: string): boolean {
    return (char >= "0" && char <= "9") || (char >= "a" && char <= "f") || (char >= "A" && char <= "F")
}

/** Only let through values that can't escape the CSS declaration they end up in. */
function isColor(value: string): boolean {
    if (value.startsWith("#")) {
        const digits = value.slice(1)
        return digits.length >= 3 && digits.length <= 8 && [...digits].every(isHexDigit)
    }

    return value.length > 0 && [...value].every(isLetter)
}

/**
 * Reads `<tag>`, `</tag>`, `<tag=value>` or `<tag:value>` at `start`,
 * or returns `null` when the `<` doesn't begin a well-formed tag.
 */
function readTag(text: string, start: number): Tag | null {
    let i = start + 1 // Skips the "<".

    const closing = text[i] === "/"
    if (closing) i++

    const nameStart = i
    while (i < text.length && isLetter(text[i])) i++
    if (i === nameStart) return null

    const name = text.slice(nameStart, i).toLowerCase()

    let value: string | undefined
    if (text[i] === "=" || text[i] === ":") {
        const valueStart = ++i
        // A "<" before the ">" means this one was never a tag to begin with.
        while (i < text.length && text[i] !== ">" && text[i] !== "<") i++
        value = text.slice(valueStart, i)
    }

    if (text[i] !== ">") return null

    return { closing, name, value, end: i + 1 }
}

/**
 * Parses Unity-style rich text into a tree of paragraphs, one per line.
 *
 * Tolerates the malformed markup the game data is full of: unclosed tags are
 * closed at the end of their paragraph, stray closing tags are dropped, text
 * that only looks like a tag stays text, and unknown tags are kept as
 * transparent wrappers so their content survives.
 */
function parseGameText(text: string): Paragraph[] {
    const paragraphs: Paragraph[] = []
    let root: GameNode[] = []
    let open: ElementNode[] = []

    const children = () => (open.length > 0 ? open[open.length - 1].children : root)

    const pushText = (value: string) => {
        if (!value) return
        const target = children()
        const last = target[target.length - 1]
        // Merge adjacent text so whitespace around dropped tags collapses naturally.
        if (last?.type === "text") last.value += value
        else target.push({ type: "text", value })
    }

    const openTag = (tag: string, value?: string) => {
        const node: ElementNode = { type: "element", tag, value, children: [] }
        children().push(node)
        open.push(node)
    }

    const closeTag = (tag: string) => {
        for (let i = open.length - 1; i >= 0; i--) {
            if (open[i].tag !== tag) continue
            // Drops any tags left unclosed inside this one, they keep their content.
            open.length = i
            return
        }
    }

    const endParagraph = () => {
        const reopen = open.map(({ tag, value }) => ({ tag, value }))
        paragraphs.push(root)
        root = []
        open = []
        // Carry tags that span a line break over into the next paragraph.
        reopen.forEach(({ tag, value }) => openTag(tag, value))
    }

    const pushLines = (chunk: string) => {
        chunk.split("\n").forEach((line, i) => {
            if (i > 0) endParagraph()
            pushText(line)
        })
    }

    let cursor = 0
    let index = text.indexOf("<")

    while (index !== -1) {
        const tag = readTag(text, index)

        if (tag === null) {
            // Not a tag, leave the "<" for the next flush to pick up as text.
            index = text.indexOf("<", index + 1)
            continue
        }

        pushLines(text.slice(cursor, index))
        cursor = tag.end

        // Unknown tags open too, they just render as a transparent wrapper.
        if (tag.closing) closeTag(tag.name)
        else openTag(tag.name, tag.value)

        index = text.indexOf("<", cursor)
    }

    pushLines(text.slice(cursor))
    paragraphs.push(root)

    return paragraphs.filter(nodes => nodes.some(hasContent))
}

function hasContent(node: GameNode): boolean {
    return node.type === "text" ? node.value.trim().length > 0 : node.children.some(hasContent)
}

function renderNodes(nodes: GameNode[], getLocalString: GetLocalStringFunc): React.ReactNode {
    return nodes.map((node, i) => {
        if (node.type === "text") return node.value

        const inner = renderNodes(node.children, getLocalString)

        switch (node.tag) {
            case "color":
                return <Text key={i} span c={node.value && isColor(node.value) ? node.value : undefined}>
                    {inner}
                </Text>
            case "i":
                return <Text key={i} span fs="italic">{inner}</Text>
            case "b":
                return <Text key={i} span fw={700}>{inner}</Text>
            case "u":
                return <Text key={i} span td="underline">{inner}</Text>
            case "s":
                return <Text key={i} span td="line-through">{inner}</Text>
            case "size":
                return <Text key={i} span fz={node.value ? `${node.value}px` : undefined}>{inner}</Text>
            case "term": {
                // Some locales ship `<Term:id></Term>` with no label, then the id is all we have.
                const label: string | undefined = node.children.length > 0 ? `${inner}` : getTerm(node.value)
                if (!label) return null
                return <Text key={i} span fw={800}>{getLocalString(label)}</Text>
            }
            default:
                return inner
        }
    })
}

export default function GameText({ text, size, gap = "xs" }: IGameTextProps): React.ReactElement {
    const paragraphs = useMemo(() => parseGameText(text), [text])

    const { getLocalString } = useSettings()

    return <Stack gap={gap}>
        {paragraphs.map((nodes, i) => <Text key={i} size={size}>{renderNodes(nodes, getLocalString)}</Text>)}
    </Stack>
}
