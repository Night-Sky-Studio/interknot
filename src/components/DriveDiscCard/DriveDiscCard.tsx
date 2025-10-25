import { Card, Group, Stack, Title, Image } from "@mantine/core"
import "./DriveDiscCard.css"
import { DriveDisc as DD, Property } from "@interknot/types"
import { ZenlessIcon, getDriveDiscGradient, getRarityIcon } from "@components/icons/Icons"
import { useSettings } from "@components/SettingsProvider"

export default function DriveDiscCard({ disc }: { disc: DD }): React.ReactElement {
    const { cvEnabled, getLocalString, getLevel } = useSettings()

    const DriveDiscStat = ({ prop }: { prop: Property }) => {
        return (
            <Group justify="space-between" className="disc-stat" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                    <ZenlessIcon id={prop.Id} size="20px" />
                    <Title order={5}>
                        { getLocalString(prop.simpleName) }
                    </Title>
                    {prop.Level > 1 &&
                        <Title order={5} lts="0.1rem" c="#ffaf29">+{ prop.Level - 1 }</Title>
                    }
                </Group>
                <Title order={4}>{ prop.formatted }</Title>
            </Group>
        )
    }

    return (
        <Card className="disc-card">
            <Card.Section bg={getDriveDiscGradient(disc.SetId)} h="96px">
                <div className="disc-header">
                    <div className="disc-header-img">
                        <div className="disc-highlight" />
                        <Image draggable={false} className="disc-img" src={disc.IconUrl} alt={disc.Name} />
                    </div>
                    <Stack gap="0">    
                        <span className="disc-title">
                            <Title order={3} c="white">{getLocalString(disc.Name)}</Title>
                            <Image h="32px" ml="2px" src={getRarityIcon(disc.Rarity)} alt={disc.Rarity.toString()} />
                        </span>
                        <Group>
                            <Title order={6} c="white">{getLevel(disc.Level)}</Title>
                            {cvEnabled && 
                                <Title order={6} c="white">CV {(disc.CritValue.Value / 100).toFixed(1)}</Title>
                            }
                        </Group>
                    </Stack>
                </div>
                    
            </Card.Section>
            <Card.Section p="md" className="disc-substats">
                <Stack gap="sm">
                    <Stack gap="4px">
                        <Title order={4}>Main Stat</Title>
                        <DriveDiscStat prop={disc.MainStat} />
                    </Stack>
                    <Stack gap="4px">
                        <Title order={4}>Sub-Stats</Title>
                        {disc.SubStats.map(ss => <DriveDiscStat key={disc.Uid ^ ss.Id} prop={ss} />)}
                    </Stack>
                </Stack>
            </Card.Section>
        </Card>
    )
}