export const YT_URL = "https://youtrack.interknot.space"
export const YT_FORM_UUID = "9d4cfe91-0118-4b92-986a-80da7f227c30"

export enum BlockType {
    Email = "email",
    Summary = "summary",
    Enum = "enum",
    Description = "description",
    Attachments = "attachments"
}

export interface Block {
    id: string
    type: BlockType
    hasValues: boolean
    title: string
    defaultValue?: string
}

export interface ClientJSApi {
    getBlocks: () => Array<Block>
    getBlockValue: (blockReference: string) => string
    getBlockValues: (blockReference: string) => Array<string>
    setBlockValue: (blockReference: string, newValue: string) => void
}

export interface FormRenderOptions {
    backendURL: string 
    formUUID: string
    theme: string 
    language: string 
}

export type GetClientJSApiFunc = (formUUID: string) => Promise<ClientJSApi>
export type RenderInlineFunc = (element: HTMLElement, options: FormRenderOptions) => Promise<void>
export type RenderFeedbackButtonFunc = (element: HTMLElement, options: FormRenderOptions) => Promise<void>

export interface YTFeedbackForm {
    getClientJSApi: GetClientJSApiFunc
    renderInline: RenderInlineFunc
    renderFeedbackButton: RenderFeedbackButtonFunc
}