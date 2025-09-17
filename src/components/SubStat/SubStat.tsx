import { Property } from "@interknot/types"
import { SimpleGrid, Stack, Group, Title, Tooltip } from "@mantine/core"
import { ZenlessIcon } from "@icons/Icons"
import "./SubStat.css"
import { useSettings } from "@components/SettingsProvider"

export function SubStat({ stat }: { stat: Property }): React.ReactElement {
    const SubStatLevel = ({ level, className }: { level: number, className?: string }) => {
        const isActive = (lvl: number) => lvl <= level
        return <SimpleGrid cols={5} spacing="3px" verticalSpacing="0" className={className}> 
            <div className="cc-disc-stat-level" data-active={isActive(2)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(3)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(4)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(5)}></div>
            <div className="cc-disc-stat-level" data-active={isActive(6)}></div>
        </SimpleGrid>
    }

    const { getLocalString } = useSettings()

    return (
        <Tooltip label={getLocalString(stat.simpleName)} openDelay={500} portalProps={{ reuseTargetNode: true }}>
            <Stack className="cc-disc-stat" gap="4px" justify="center">
                <Group align="center" gap="4px" wrap="nowrap">
                    <ZenlessIcon id={stat.Id} size={20} />
                    <Title order={6} fz="18px">{stat.formatted}</Title>
                </Group>
                <SubStatLevel className="cc-disc-stat-levels" level={stat.Level}/>
            </Stack>
        </Tooltip>
    )
}