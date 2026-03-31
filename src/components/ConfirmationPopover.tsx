import { Input, InputWrapper, Popover, InputProps, Button, Stack, MantineComponent } from "@mantine/core"
import React, { useState } from "react"

interface IConfirmationPopoverProps extends MantineComponent<any> {
    label?: string
    description?: string

    withTextInput?: boolean

    children: React.ReactNode
    inputProps?: InputProps

    confirmationText?: string
    cancelText?: string

    onConfirm?: (text: string) => void
    onPopoverCancel?: () => void

    opened?: boolean
    onClose?: () => void
}

export default function ConfirmationPopover({
    label,
    description,
    children,
    withTextInput,
    inputProps,
    confirmationText,
    cancelText,
    onConfirm,
    opened, onClose,
    ...props
}: IConfirmationPopoverProps) {
    const [text, setText] = useState("")

    return (
        <Popover opened={opened} onClose={onClose} withArrow withinPortal withOverlay>
            <Popover.Target>
                {children}
            </Popover.Target>
            <Popover.Dropdown {...props}>
                <InputWrapper label={label} description={description}>
                    <Stack>
                        { withTextInput &&
                            <Input {...inputProps} value={text} onChange={(e) => setText(e.currentTarget.value)} /> }
                        <Button mt={!withTextInput ? "md" : undefined} onClick={() => {
                            onConfirm?.(text)
                            onClose?.()
                        }}>{confirmationText ?? "OK"}</Button>
                        <Button variant="light" onClick={() => {
                            onClose?.()
                        }}>{cancelText ?? "Cancel"}</Button>
                    </Stack>
                </InputWrapper>
            </Popover.Dropdown>
        </Popover>
    )
}