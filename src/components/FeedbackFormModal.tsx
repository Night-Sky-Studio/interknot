import { BlockType, YT_FORM_UUID, YT_URL, YTFeedbackForm } from "@api/youtrack"
import { Modal } from "@mantine/core"
import { useCallback } from "react"

export interface IErrorData {
    error: string
    stack: string
    componentStack: string
    userAgent: string
    url: string
}

export interface IFeedbackFormModalProps {
    data?: IErrorData
    opened: boolean
    onClose: () => void
}

export function FeedbackFormModal({ data, opened, onClose }: IFeedbackFormModalProps) {
    const containerRef = useCallback((node: HTMLDivElement | null) => {
        if (!node || !opened) return;

        const ff = (window as any)["YTFeedbackForm"] as YTFeedbackForm

        ff.renderInline(node, {
            backendURL: YT_URL,
            formUUID: YT_FORM_UUID,
            theme: "dark",
            language: "en",
        })

        if (data) {
            ff.getClientJSApi(YT_FORM_UUID).then(async form => {
                form.setBlockValue(BlockType.Summary, `Render Error: ${data.error}`)
                form.setBlockValue(BlockType.Description, `
                    - URL: \`${data.url}\`
                    - UserAgent: \`${data.userAgent}\`
                    # Stack Trace
                    \`\`\`
                    ${data.stack}
                    \`\`\`

                    # Component stack
                    \`\`\`
                    ${data.componentStack}
                    \`\`\` 
                    `)
            })
        }
    }, [opened])

    return <>
        <Modal.Root opened={opened} onClose={onClose}>
            <Modal.Overlay />
            <Modal.Content>
                <div id="yt-form-content" ref={containerRef} />
            </Modal.Content>
        </Modal.Root>
    </>
}