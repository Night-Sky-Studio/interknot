import { Property } from "@interknot/types"
import { SimpleGrid, Stack, Group, Title } from "@mantine/core"
import { ZenlessIcon } from "./icons/Icons"
import "./styles/SubStat.css"

export function SubStat({ stat }: { stat: Property }): React.ReactElement {
    const SubStatLevel = ({ level }: { level: number }) => {
        const isActive = (lvl: number) => lvl <= level
        return <SimpleGrid cols={5} spacing="2px" verticalSpacing="0"> 
            <div className="cc-disc-stat-level" data-active={isActive(2)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(3)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(4)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(5)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(6)}></div>
        </SimpleGrid>
    }

    return (
        <Stack className="cc-disc-stat" gap="1px">
            <Group align="flex-start" gap="4px" wrap="nowrap">
                <ZenlessIcon id={stat.Id} size={12} />
                <Title order={6} fz="11px" mt="-2px" h="12px">{stat.formatted}</Title>
            </Group>
            <SubStatLevel level={stat.Level}/>
        </Stack>
    )
}