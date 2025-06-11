import { useMantineTheme, Group, Title, Stack, SimpleGrid, Center, Image } from "@mantine/core"
import { getDriveDiscGradient, getRarityIcon, ZenlessIcon } from "./icons/Icons"
import { DriveDisc as DD } from "@interknot/types"
import { SubStat } from "./SubStat"
import "./styles/DriveDisc.css"

function SlotIcon({ slot }: { slot: number }): React.ReactElement {
    return <div className="cc-disc-slot">
        <div>
            <Title ff="zzz-jp, monospace" order={3}>{slot}</Title>
        </div>
    </div>
}

export function DriveDisc({ slot, disc }: { slot: number, disc: DD | null }): React.ReactElement {
    const theme = useMantineTheme()

    const cvColor = (cv: number) => {
        switch(true) {
            case cv >= 28.8: return theme.colors.red[7]
            case cv >= 24: return theme.colors.pink[7]
            case cv >= 19.2: return theme.colors.grape[7]
            case cv >= 14.4: return theme.colors.violet[6]
            case cv >= 9.6: return theme.colors.blue[6]
            default: return undefined
        }
    }

    return (<>
        {disc !== null ? 
            <div className="cc-disc" style={{ "--disc-gradient": getDriveDiscGradient(disc.SetId), "--cv": cvColor(disc.CritValue.Value / 100) } as React.CSSProperties}>
                <Group gap="4px" className="cc-disc-main" wrap="nowrap">
                    <div className="cc-disc-icon">
                        <Image src={disc.IconUrl} alt={disc.Name} />
                        <Image src={getRarityIcon(disc.Rarity)} alt={disc.Rarity.toString()} />
                        <Title order={6} fz="11px" ff="zzz-jp">{slot}</Title>
                    </div>
                    <Stack gap="0px" justify="justify-evenly" style={{ zIndex: "100" }}>
                        <Title order={6} fz="14px">Lv. {disc.Level}</Title>
                        <Group gap="2px" wrap="nowrap">
                            <ZenlessIcon id={disc.MainStat.Id} size="32px"/>
                            <Title order={6} fz="24px">{disc.MainStat.formatted}</Title>
                        </Group>
                        <Title order={6} fz="14px">CV {(disc.CritValue.Value / 100).toFixed(1)}</Title>
                    </Stack>
                </Group>
                <SimpleGrid cols={2} spacing="8px" verticalSpacing="8px" className="cc-disc-stats">
                    {
                        disc.SubStats.map(ss => <SubStat key={disc.Uid ^ ss.Id} stat={ss} />)
                    }
                </SimpleGrid>
            </div>
        : <div className="cc-disc" style={{ "--disc-gradient": "linear-gradient(135deg, #404040, #202020)" } as React.CSSProperties}>
            <Group gap="4px" className="cc-disc-main" style={{ borderRadius: "48px" }} wrap="nowrap">
                <div className="cc-disc-icon">
                    <SlotIcon slot={slot}  />
                </div>
                <Center style={{ zIndex: 100 }}>
                    <Title order={6} fz="18px" pl="sm">Empty</Title>
                </Center>
            </Group>
        </div>
        }
    </>)
}