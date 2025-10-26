import { UnstyledButton, Center, Stack, Group, Button, FloatingIndicator, Title, Switch, Popover, Flex, ActionIcon, Loader } from "@mantine/core"
import { IconDownload, IconTools, IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import BuildInfo from "@components/BuildInfo/BuildInfo"
import "./CardFooter.css"
import { useDisclosure } from "@mantine/hooks"
import { useLeaderboards } from "@components/LeaderboardProvider"
import { useCardSettings } from "@components/CardSettingsProvider"
import LeaderboardEntrySelect from "../LeaderboardEntrySelect"
import { useSettings } from "../SettingsProvider"
import { domToPng } from 'modern-screenshot'
import { useData } from "../DataProvider"
import { TooltipData } from "../CharacterCard/CharacterCard"

const data = ["Damage distribution", "Sub-stat priority", "Leaderboards"]

export default function CardFooter(): React.ReactElement {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({})
    const [active, setActive] = useState(-1)
    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node
        setControlsRefs(controlsRefs)
    }

    const controls = data.map((item, index) => (
        <UnstyledButton
            key={item}
            className="control"
            size="xs"
            variant="transparent"
            ref={setControlRef(index)}
            onClick={() => setActive(index === active ? -1 : index)}
            mod={{ active: active === index }}
            disabled={index === 1}
            data-disabled={index === 1 ? true : undefined}>
            <span className="controlLabel">{item}</span>
        </UnstyledButton>
    ))

    const [opened, { open, close }] = useDisclosure(false)

    const { cvEnabled, getLocalString } = useSettings()
    const { isAvailable, entries, highlightId } = useLeaderboards()
    const { context: cardSettings, contextAvailable } = useCardSettings()
    const cardData = useData<TooltipData>()

    useEffect(() => {
        cardSettings?.setShowGraph(isAvailable && cardSettings.showGraph)
    }, [isAvailable])

    const [downloading, setDownloading] = useState(false)

    return (<>        
        <Center w="100%">
            <Stack w="100%" maw="100%">
                <Group wrap="nowrap">
                    { contextAvailable && cardSettings && <>
                        <Button variant="subtle" disabled={downloading} leftSection={downloading ? <Loader size="sm" /> : <IconDownload />}
                            onClick={async () => {
                                const cardRef = cardSettings?.cardRef?.current

                                if (!cardRef) {
                                    console.error("Card ref is null")
                                    return
                                }

                                setDownloading(true)

                                // clone card DOM
                                const clone = cardRef.cloneNode(true) as HTMLElement
                                clone.style.position = "absolute"
                                clone.style.top = "0px"
                                clone.style.left = "0px"
                                clone.style.zIndex = "-9999"
                                clone.style.transform = "scale(1) !important"
                                document.body.appendChild(clone)

                                const dataUrl = await domToPng(clone, {
                                    quality: 1.0,
                                    backgroundColor: "transparent",
                                    scale: 2
                                })

                                // remove clone
                                document.body.removeChild(clone)

                                const link = document.createElement("a")
                                link.download = `${getLocalString(cardData.charName)}-${cardData.uid}.png`
                                link.href = dataUrl
                                link.click()

                                setDownloading(false)
                            }}>Download image</Button>
                        <Popover opened={opened} withArrow position="top-start" shadow="0px 0px 32px rgba(0 0 0 / 75%)"
                            transitionProps={{ transition: "pop" }}
                            closeOnClickOutside={false} closeOnEscape={false}>
                            <Popover.Target>
                                <Button variant={opened ? "filled" : "subtle"} leftSection={<IconTools />} onClick={() => {
                                    if (opened) {
                                        close()
                                    } else {
                                        open()
                                    }
                                }}>Card Customization</Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Stack>
                                    <Flex justify="space-between" align="center" w="100%">
                                        <Title order={3} miw="384px">Card Customization</Title>
                                        <ActionIcon variant="subtle" onClick={close}><IconX /></ActionIcon>
                                    </Flex>
                                    <Switch label="Show graph"
                                        checked={cardSettings.showGraph}
                                        disabled={!isAvailable}
                                        onChange={(evt) => cardSettings.setShowGraph(evt.target.checked)} />
                                    { cardSettings.showGraph && <>
                                        <LeaderboardEntrySelect entries={entries} 
                                            initialLeaderboardId={cardSettings.selectedLeaderboardId ?? highlightId} showRanking
                                            onEntrySelect={(entry) => cardSettings.setSelectedLeaderboardId(entry.Leaderboard.Id)} />
                                        <Switch label="Show ranking"
                                            checked={cardSettings.showRanking}
                                            onChange={(evt) => cardSettings.setShowRanking(evt.target.checked)} />
                                    </>}
                                    <Switch label="Show substats breakdown" 
                                        checked={cardSettings.showSubstatsBreakdown}
                                        onChange={(evt) => cardSettings.setShowSubstatsBreakdown(evt.target.checked)} />
                                    {/* <Switch label="Show build name"
                                        checked={cardSettings.showBuildName}
                                        onChange={(evt) => cardSettings.setShowBuildName(evt.target.checked)} /> */}
                                    <Switch label="Show user information"
                                        checked={cardSettings.showUserInfo}
                                        onChange={(evt) => cardSettings.setShowUserInfo(evt.target.checked)} />
                                    { cvEnabled &&
                                        <Switch label="Show crit value"
                                            checked={cardSettings.showCritValue}
                                            onChange={(evt) => cardSettings.setShowCritValue(evt.target.checked)} />
                                    }
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    </> }
                    { isAvailable &&
                        <div className="root" ref={setRootRef}>
                            {controls}

                            <FloatingIndicator
                                target={controlsRefs[active]}
                                parent={rootRef}
                                className="indicator"
                            />
                        </div>
                    }
                </Group>
                {active !== -1 &&
                    <BuildInfo mode={active} />
                }
            </Stack>
        </Center>
    </>)
}