import { UnstyledButton, Center, Stack, Group, Button, FloatingIndicator, Title, Switch, Popover, Flex, ActionIcon, Loader, Text, TextInput, Tooltip, LoadingOverlay } from "@mantine/core"
import { IconArchiveFilled, IconDeviceFloppy, IconDownload, IconEye, IconEyeOff, IconPencil, IconPhotoCog, IconSettings, IconTools, IconTrashFilled, IconX } from "@tabler/icons-react"
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
import { useAuth } from "@components/AuthProvider"
import { ICardContext } from "../CharacterCard/CharacterCard"
import { match, type SimpleBuild } from "@interknot/types"
import { archiveBuild, deleteBuild, setBuildName, setBuildVisibility } from "@/api/data"

const data = ["Damage distribution", "Sub-stat priority", "Leaderboards"]

interface ICardFooterProps {
    onBuildsUpdated?: () => void
}

export default function CardFooter({ onBuildsUpdated }: ICardFooterProps): React.ReactElement {
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

    const [customizationOpened, { open: openCustomization, close: closeCustomization }] = useDisclosure(false)
    const [buildSettingsOpened, { open: openBuildSettings, close: closeBuildSettings }] = useDisclosure(false)

    const { cvEnabled, getLocalString } = useSettings()
    const { isAvailable, entries, highlightId } = useLeaderboards()
    const { context: cardSettings, contextAvailable } = useCardSettings()
    const { account } = useAuth()
    const { build, owner } = useData<ICardContext>()

    useEffect(() => {
        cardSettings?.setShowGraph(isAvailable && cardSettings.showGraph)
    }, [isAvailable])

    const [downloading, setDownloading] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [tempBuildName, setTempBuildName] = useState("")
    const [isArchivePopoverOpened, { open, close }] = useDisclosure(false)
    const [archivedBuildName, setArchivedBuildName] = useState("")

    const resolveBuildName = (build: SimpleBuild, name: string) => match(name, [
        [getLocalString(build.Character.Name), () => null], // default name by locale
        [build.Character.Name, () => null], // default name by game data
        [build.Name, () => build.Name ?? null], // current build name
        ["", () => null], // empty string
        () => name
    ])

    return (<>        
        <Center w="100%">
            <Stack w="100%" maw="100%">
                <Group wrap="nowrap" gap="xs">
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
                                link.download = `${getLocalString(build.Character.Name)}-${owner.Uid}.png`
                                link.href = dataUrl
                                link.click()

                                setDownloading(false)
                            }}>Download image</Button>
                        <Popover opened={customizationOpened} withArrow position="top-start" shadow="0px 0px 32px rgba(0 0 0 / 75%)"
                            transitionProps={{ transition: "pop" }}
                            closeOnClickOutside={false} closeOnEscape={false}>
                            <Popover.Target>
                                <Button variant={customizationOpened ? "filled" : "subtle"} leftSection={<IconTools />} onClick={() => {
                                    if (buildSettingsOpened) {
                                        closeBuildSettings()
                                    }
                                    if (customizationOpened) {
                                        closeCustomization()
                                    } else {
                                        openCustomization()
                                    }
                                }}>Card Customization</Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Stack>
                                    <Flex justify="space-between" align="center" w="100%">
                                        <Title order={3} miw="384px">Card Customization</Title>
                                        <ActionIcon variant="subtle" onClick={closeCustomization}><IconX /></ActionIcon>
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
                        {
                            account && account.ClaimedProfiles.find(p => p.Uid === owner.Uid) &&
                            <Popover opened={buildSettingsOpened} withArrow position="top-start" shadow="0px 0px 32px rgba(0 0 0 / 75%)"
                                transitionProps={{ transition: "pop" }} 
                                closeOnClickOutside={false} closeOnEscape={false}>
                                <Popover.Target>
                                    <Button variant={buildSettingsOpened ? "filled" : "subtle"} leftSection={<IconSettings />} onClick={() => {
                                        if (customizationOpened) {
                                            closeCustomization()
                                        }
                                        if (buildSettingsOpened) {
                                            closeBuildSettings()
                                        } else {
                                            openBuildSettings()
                                        }
                                    }}>Build Settings</Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <LoadingOverlay visible={isLoading} />
                                    <Stack>
                                        <Flex justify="space-between" align="center" w="100%">
                                            <Title order={3} miw="384px">Build Settings</Title>
                                            <ActionIcon variant="subtle" onClick={closeBuildSettings}><IconX /></ActionIcon>
                                        </Flex>
                                        <Flex gap="xs" align="center">
                                            <Text fw="bold">Name</Text>
                                            { !isEditing 
                                                ? <Text style={{ flexGrow: 1 }}>
                                                    {build.Name ?? getLocalString(build.Character.Name)}
                                                </Text>
                                                : <TextInput style={{ flexGrow: 1 }} value={tempBuildName} 
                                                             onChange={(evt) => setTempBuildName(evt.target.value)}
                                                             maxLength={16} />
                                            }
                                            <ActionIcon onClick={async () => {
                                                if (isEditing) {
                                                    const finalName = resolveBuildName(build, tempBuildName)
                                                    console.log(build.Id, tempBuildName, finalName)
                                                    setIsLoading(true)
                                                    await setBuildName(owner.Uid, build.Id, finalName)
                                                    setIsLoading(false)
                                                    onBuildsUpdated?.()
                                                    // reloadBuilds()
                                                } else {
                                                    setTempBuildName(build.Name ?? getLocalString(build.Character.Name))
                                                }
                                                setIsEditing(!isEditing)
                                            }}>
                                                { isEditing ? <IconDeviceFloppy /> : <IconPencil /> }
                                            </ActionIcon>
                                        </Flex>
                                        <Button.Group>
                                            <Button variant="filled" leftSection={<IconPhotoCog />} onClick={() => {
                                                // onImageCustomization?.()
                                                cardSettings.setIsEditing(true)
                                                closeBuildSettings()
                                            }}>Adjust image</Button>
                                            <Button variant="filled" leftSection={build.IsPublic ? <IconEyeOff /> : <IconEye />} 
                                                onClick={async () => {
                                                    setIsLoading(true)
                                                    await setBuildVisibility(owner.Uid, build.Id, build.IsPublic)
                                                    onBuildsUpdated?.()
                                                    setIsLoading(false)
                                                }}>
                                                { build.IsPublic ? "Hide Build" : "Show Build" }
                                            </Button>
                                        <Popover withArrow withOverlay opened={isArchivePopoverOpened} onClose={close}>
                                            <Popover.Target>
                                                <Tooltip label="Archive Build" withinPortal>
                                                    <Button leftSection={<IconArchiveFilled />} onClick={() => {
                                                        if (isArchivePopoverOpened) {
                                                            close()
                                                        } else {
                                                            open()
                                                        }
                                                    }}>
                                                        Archive Build
                                                    </Button>
                                                </Tooltip>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <Stack>
                                                    <TextInput label="Enter build name"
                                                        description="Can be left empty to use character name"
                                                        placeholder={getLocalString(build.Character.Name)}
                                                        value={archivedBuildName}
                                                        onChange={(e) => setArchivedBuildName(e.currentTarget.value)}
                                                        maxLength={16} />
                                                    <Button onClick={async () => {
                                                        setIsLoading(true)
                                                        const finalName = resolveBuildName(build, archivedBuildName)
                                                        await archiveBuild(owner.Uid, build.Id, finalName)
                                                        setArchivedBuildName("")
                                                        onBuildsUpdated?.()
                                                        setIsLoading(false)
                                                        close()
                                                    }}>Archive Build</Button>
                                                    <Button variant="light" onClick={() => {
                                                        setArchivedBuildName("")
                                                        close()
                                                    }}>Cancel</Button>
                                                </Stack>
                                            </Popover.Dropdown>
                                        </Popover>
                                        <Button variant="filled" leftSection={<IconTrashFilled />} color="red" 
                                            onClick={async () => {
                                                await deleteBuild(owner.Uid, build.Id)
                                                onBuildsUpdated?.()
                                            }}>Delete Build</Button>
                                        </Button.Group>
                                        {/* </SimpleGrid> */}
                                    </Stack>
                                </Popover.Dropdown>
                            </Popover>
                        }
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