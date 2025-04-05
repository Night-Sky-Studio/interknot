import { Collapse, Table, TableTrProps } from "@mantine/core";
import { memo, useEffect, useState } from "react";

interface IExpandableRowProps extends TableTrProps {
    ref: any
    opened: boolean
    transitionDuration?: number
    onClick?: () => void
}

export function ExpandableRow({ ref, children, opened, transitionDuration, onClick, ...props }: IExpandableRowProps): React.ReactElement {
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

    return (
        <Table.Tr ref={ref} {...props} onClick={(e) => {
            e.stopPropagation()
            onClick?.()
        }}>
            <Table.Td colSpan={100} p={0}>
                <Collapse in={opened} transitionDuration={duration}>
                    {isContentVisible && children}
                </Collapse>
            </Table.Td>
        </Table.Tr>
    );
}
export const ExpandableRowMemoized = memo(ExpandableRow)