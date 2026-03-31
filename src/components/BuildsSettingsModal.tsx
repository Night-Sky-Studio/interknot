import { archiveBuild, deleteBuild, getUserBuilds, setBuildName, setBuildVisibility } from "@/api/data"
import { ActionIcon, Alert, Avatar, Button, Card, Center, Flex, Group, Input, LoadingOverlay, Modal, Popover, ScrollArea, Stack, Text, TextInput, Tooltip } from "@mantine/core"
import React, { useMemo, useState } from "react"
import { useAsyncRetry } from "react-use"
import { useSettings } from "./SettingsProvider"
import {
    IconArchiveFilled, IconDeviceFloppy, IconEye,
    IconEyeClosed, IconPencil, IconStarFilled, IconTrashFilled
} from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { match, type SimpleBuild } from "@interknot/types"

interface IBuildsSettingsModalProps {
    uid: number
    opened: boolean
    onBuildsUpdated?: () => void
    onClose: () => void
}

export default function BuildsSettingsModal({ uid, opened, onBuildsUpdated, onClose }: IBuildsSettingsModalProps): React.ReactElement {
    const { getLocalString } = useSettings()

    const [search, setSearch] = useState("")

    const { retry: reloadBuilds, ...buildsState } = useAsyncRetry(async () => {
        return await getUserBuilds(uid)
    })
    const builds = useMemo(() => buildsState.value?.data,
        [buildsState.value?.data, search])

    const filteredBuilds = useMemo(() => {
        if (search === "") return builds ?? []
        return builds?.filter(b => (b.Name ?? getLocalString(b.Character.Name))
            .toLowerCase().includes(search.toLowerCase())) ?? []
    }, [builds, search])

    const resolveBuildName = (build: SimpleBuild, name: string) => match(name, [
        [getLocalString(build.Character.Name), () => null], // default name by locale
        [build.Character.Name, () => null], // default name by game data
        [build.Name, () => build.Name ?? null], // current build name
        ["", () => null], // empty string
        () => name
    ])

    const BuildRow = ({ build }: { build: SimpleBuild }) => {
        const [archivedBuildName, setArchivedBuildName] = useState("")

        const [isLoading, setIsLoading] = useState(false)
        const [isPopoverOpened, { open, close }] = useDisclosure(false)

        const [isEditing, setIsEditing] = useState(false)
        const [tempBuildName, setTempBuildName] = useState<string>("")

        return (
            <Card shadow="sm" radius="xl" mb="xs">
                <Card.Section>
                    <LoadingOverlay visible={isLoading} loaderProps={{ type: "dots" }}
                        zIndex={1000} />
                    <Flex align="center" gap="xs">
                        <Group gap="xs">
                            <Avatar src={build.Character.CircleIconUrl} />
                            {build.IsPrimary && <Tooltip label="Primary Build" withinPortal>
                                <ActionIcon disabled>
                                    <IconStarFilled />
                                </ActionIcon>
                            </Tooltip>}
                        </Group>
                        {isEditing 
                            ? <TextInput style={{ flexGrow: 1 }}
                                value={tempBuildName}
                                placeholder={build.Name ?? getLocalString(build.Character.Name)}
                                onChange={(e) => setTempBuildName(e.currentTarget.value)}
                                maxLength={16} />
                            : <Text style={{ flexGrow: 1 }} 
                                c={build.Name === undefined ? "dimmed" : "white"}>
                                    {build.Name ?? getLocalString(build.Character.Name)}
                                </Text>
                        }
                        <Group wrap="nowrap" gap="xs">
                            <ActionIcon.Group>
                                <Tooltip label={isEditing ? "Save Build Name" : "Edit Build Name"} withinPortal>
                                    <ActionIcon onClick={async () => {
                                        if (isEditing) {
                                            const finalName = resolveBuildName(build, tempBuildName)
                                            console.log(build.Id, tempBuildName, finalName)
                                            setIsLoading(true)
                                            await setBuildName(uid, build.Id, finalName)
                                            setIsLoading(false)
                                            onBuildsUpdated?.()
                                            reloadBuilds()
                                        } else {
                                            setTempBuildName(build.Name ?? getLocalString(build.Character.Name))
                                        }
                                        setIsEditing(!isEditing)
                                    }}>
                                        {isEditing ? <IconDeviceFloppy /> : <IconPencil />}
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label={build.IsPublic ? "Hide Build" : "Show Build"} withinPortal>
                                    <ActionIcon onClick={async () => {
                                        setIsLoading(true)
                                        // this takes `isHidden` param, but build only exposes `IsPublic` xd
                                        await setBuildVisibility(uid, build.Id, build.IsPublic)
                                        setIsLoading(false)
                                        onBuildsUpdated?.()
                                        reloadBuilds()
                                    }}>
                                        {build.IsPublic ? <IconEye /> : <IconEyeClosed />}
                                    </ActionIcon>
                                </Tooltip>
                                <Popover withArrow withOverlay opened={isPopoverOpened} onClose={close}>
                                    <Popover.Target>
                                        <Tooltip label="Archive Build" withinPortal>
                                            <ActionIcon onClick={open}>
                                                <IconArchiveFilled />
                                            </ActionIcon>
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
                                                const finalName = resolveBuildName(build, archivedBuildName)
                                                setIsLoading(true)
                                                await archiveBuild(uid, build.Id, finalName)
                                                setIsLoading(false)
                                                setArchivedBuildName("")
                                                onBuildsUpdated?.()
                                                reloadBuilds()
                                            }}>Archive Build</Button>
                                            <Button variant="light" onClick={() => {
                                                setArchivedBuildName("")
                                                close()
                                            }}>Cancel</Button>
                                        </Stack>
                                    </Popover.Dropdown>
                                </Popover>
                                <Tooltip label="Delete Build" withinPortal>
                                    <ActionIcon onClick={async () => {
                                        setIsLoading(true)
                                        await deleteBuild(uid, build.Id)
                                        setIsLoading(false)
                                        onBuildsUpdated?.()
                                        reloadBuilds()
                                    }}>
                                        <IconTrashFilled />
                                    </ActionIcon>
                                </Tooltip>
                            </ActionIcon.Group>
                        </Group>
                    </Flex>
                </Card.Section>
            </Card>
        )
    }

    return (
        <Modal.Root opened={opened} onClose={onClose} size="lg">
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Builds Settings</Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body p="0">
                    <LoadingOverlay visible={buildsState.loading} zIndex={10} />
                    {builds &&
                        <Stack gap="xs">
                            <Input placeholder="Search Builds" mx="xs"
                                value={search} onChange={(e) => setSearch(e.currentTarget.value)}
                                rightSection={search !== "" ? <Input.ClearButton onClick={() => setSearch("")} /> : undefined}
                                rightSectionPointerEvents="auto" />
                            <ScrollArea mih="480px" h="480px" >
                                <Stack mx="sm" gap="0">
                                    {filteredBuilds.map(build => <BuildRow key={build.Id} build={build} />)}
                                </Stack>
                            </ScrollArea>
                        </Stack>
                    }
                    {/* {buildsState.loading &&
                        <Center><Loader /></Center>
                    } */}
                    {!buildsState.error && builds?.length === 0 &&
                        <Center>
                            <Alert title="No Builds Found" color="yellow">
                                This profile has no builds yet.
                            </Alert>
                        </Center>
                    }
                    {buildsState.error &&
                        <Center>
                            <Alert title="Error Loading Builds" color="red">
                                {buildsState.error.message}
                            </Alert>
                        </Center>
                    }
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}