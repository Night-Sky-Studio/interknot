import { Collapse, Table, TableTrProps } from "@mantine/core"
import { memo, useEffect, useMemo, useState } from "react"

interface IExpandableRowProps extends TableTrProps {
    ref?: any
    opened: boolean
    transitionDuration?: number
    onClick?: () => void
}

export function ExpandableRow({ ref, children, opened, transitionDuration, onClick, className, ...props }: IExpandableRowProps): React.ReactElement {
    const [isContentVisible, setIsContentVisible] = useState(false)

    const duration = transitionDuration || 200

    useEffect(() => {
        if (opened) {
            setIsContentVisible(true)
        } else {
            setTimeout(() => {
                setIsContentVisible(false)
            }, duration)
        }
    }, [opened]) 

    const fullClass = useMemo(() => `${className ?? ""} expandable-row`, [className])

    return (
        <Table.Tr ref={ref} className={fullClass} {...props} onClick={(e) => {
            e.stopPropagation()
            onClick?.()
        }} style={{ borderBottomWidth: opened ? "1px" : "0" }}>
            <Table.Td colSpan={100} p={0}>
                <Collapse in={opened} transitionDuration={duration}>
                    {isContentVisible && children}
                </Collapse>
            </Table.Td>
        </Table.Tr>
    );
}
export const ExpandableRowMemoized = memo(ExpandableRow)