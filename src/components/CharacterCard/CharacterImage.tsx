import "./CharacterCard.css"
import "./CharacterImage.css"
import { useCardSettings } from "@components/CardSettingsProvider"
import {
    ActionIcon,
    Button,
    Center,
    ColorInput,
    Flex,
    Group,
    Image as MImage,
    Loader,
    Popover,
    Stack,
    Text,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { Dropzone } from "@mantine/dropzone"
import {
    IconFlipVertical,
    IconPaletteFilled,
    IconPhoto,
    IconRestore,
    IconUpload,
    IconX,
    IconZoomIn,
    IconZoomOut,
    IconZoomReset
} from "@tabler/icons-react"
// import { useAuth } from "@components/AuthProvider" // TODO: upload
import { useData } from "@components/DataProvider"
import { ICardContext } from "./CharacterCard"
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { type CardCustomization, type Transform } from "@interknot/types"
import { useAsyncRetry } from "react-use"
import { getDefaultCustomization } from "./imageDefaults"
import {
    clamp,
    computePlacement,
    MAX_SCALE,
    mergeTransforms,
    MIN_SCALE,
    placementTransform,
    ZOOM_STEP,
    useImageSize
} from "./imageTransforms"

interface ICharacterImageProps {
    src: string
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif", "image/avif"]

/** Marks that custom art for this build lives in OPFS */
const CUSTOM_IMAGE_MARKER = "local"

interface DragState {
    pointerId: number
    clientX: number
    clientY: number
    /** Normalized offsets when the drag started */
    originX: number
    originY: number
    /** Live normalized offsets */
    x: number
    y: number
}

function DropzoneContent({ title, img }: { title: string, img?: string }) {
    return (<>
        <Group justify="center" h="128px" gap="0" style={{ pointerEvents: "none" }}>
            {
                img !== undefined
                    ? <MImage src={img} alt={title} h="100%"/>
                    : <div style={{ marginLeft: "1rem" }}>
                        <Dropzone.Accept>
                            <IconUpload size={32} color="var(--mantine-color-blue-6)" stroke={1.5}/>
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX size={32} color="var(--mantine-color-red-6)" stroke={1.5}/>
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size={32} color="var(--mantine-color-dimmed)" stroke={1.5}/>
                        </Dropzone.Idle>
                    </div>
            }
            <Stack gap="0" mx="lg">
                <Text size="lg" inline>
                    {title}
                </Text>
                <Text size="sm" c="dimmed" mt={7}>
                    Supported formats: PNG, JPEG, WEBP, HEIC, HEIF, AVIF
                </Text>
            </Stack>
        </Group>
    </>)
}

async function getSavedImageUrl(uid: number, buildId: number) {
    try {
        const root = await navigator.storage.getDirectory()

        const characters = await root.getDirectoryHandle("characters")
        const userDir = await characters.getDirectoryHandle(`${uid}`)
        const handle = await userDir.getFileHandle(`${buildId}.png`)
        const file = await handle.getFile()
        return URL.createObjectURL(file)
    } catch (e) {
        console.warn("No saved image found", buildId)
        return undefined
    }
}

async function saveImage(uid: number, buildId: number, file: File) {
    try {
        const root = await navigator.storage.getDirectory()

        const characters = await root.getDirectoryHandle("characters", { create: true })
        const userDir = await characters.getDirectoryHandle(`${uid}`, { create: true })
        const handle = await userDir.getFileHandle(`${buildId}.png`, { create: true })

        const writable = await handle.createWritable()
        await writable.write(file)
        await writable.close()

        console.log("Saved image", `/${uid}/${buildId}.png`)
    } catch (e) {
        console.warn("Failed to save image", e, buildId)
    }
}

async function deleteSavedImage(uid: number, buildId: number) {
    try {
        const root = await navigator.storage.getDirectory()

        const characters = await root.getDirectoryHandle("characters")
        const userDir = await characters.getDirectoryHandle(`${uid}`)
        await userDir.removeEntry(`${buildId}.png`)
        console.log("Deleted saved image for build", buildId)
    } catch (e) {
        console.warn("Failed to delete saved image", e, buildId)
    }
}

export default function CharacterImage({ src }: ICharacterImageProps): React.ReactElement {
    const {
        cardCustomization,
        isEditing,
        cardScale,
        setCardCustomization,
        setIsEditing,
        getLocalCustomization,
        setLocalCustomization
    } = useCardSettings().context || {}

    const { build, owner } = useData<ICardContext>()
    // const { account } = useAuth() // TODO: supporters

    const previousCustomizationRef =
        useRef<CardCustomization | undefined>(undefined)
    useEffect(() => {
        if (isEditing) {
            previousCustomizationRef.current = cardCustomization
                ? structuredClone(cardCustomization)
                : undefined
        }
    }, [isEditing])

    // Load the saved customization once per build
    useEffect(() => {
        setCardCustomization?.(getLocalCustomization?.(build.Id))
    }, [build.Id])

    const { value: savedImg, loading: imgLoading, retry } = useAsyncRetry(async () =>
        await getSavedImageUrl(owner.Uid, build.Id), [owner.Uid, build.Id])

    // Pending image state: holds a dropped file until Save is confirmed
    const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
    const [pendingImageUrl, setPendingImageUrl] = useState<string | undefined>(undefined)
    useEffect(() => {
        if (!pendingImageFile) {
            setPendingImageUrl(undefined)
            return
        }
        const url = URL.createObjectURL(pendingImageFile)
        setPendingImageUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [pendingImageFile])

    const customImg = pendingImageUrl ?? savedImg
    // Hold off until the stored-image lookup settles, so the default art is never loaded for a
    // build that turns out to have custom art
    const url = imgLoading ? undefined : (customImg ?? src)

    const { value: imgSize, loading: sizeLoading } = useImageSize(url)

    // Art overrides describe the game's own image, not whatever the user uploaded
    const artOverride = useMemo(() => customImg
        ? undefined
        : getDefaultCustomization(build.Character.Id, build.Character.Skin?.Id),
        [customImg, build.Character.Id, build.Character.Skin?.Id])

    // Per-art override <- user customization, each field independently
    const transform = useMemo(() =>
        mergeTransforms(artOverride?.CharacterTransform, cardCustomization?.CharacterTransform),
        [artOverride, cardCustomization?.CharacterTransform])

    const { ref: frameRef, width: frameWidth, height: frameHeight } = useElementSize<HTMLDivElement>()

    const placement = useMemo(() => {
        if (!imgSize || frameWidth <= 0 || frameHeight <= 0) return undefined
        return computePlacement({ width: frameWidth, height: frameHeight }, imgSize, transform)
    }, [imgSize, frameWidth, frameHeight, transform])

    const updateTransform = (patch: Partial<Transform>) => {
        setCardCustomization?.({
            ...cardCustomization,
            CharacterTransform: { ...cardCustomization?.CharacterTransform, ...patch }
        })
    }

    const imgRef = useRef<HTMLImageElement>(null)
    const dragRef = useRef<DragState | null>(null)
    const frameIdRef = useRef<number | null>(null)
    const [dragging, setDragging] = useState(false)

    const syncLiveTransform = useCallback(() => {
        const drag = dragRef.current
        const img = imgRef.current
        if (!drag || !img || !imgSize || frameWidth <= 0 || frameHeight <= 0) return

        img.style.transform = placementTransform(computePlacement(
            { width: frameWidth, height: frameHeight },
            imgSize,
            mergeTransforms(transform, { X: drag.x, Y: drag.y })
        ))
    }, [imgSize, frameWidth, frameHeight, transform])

    // Re-assert the live position after any render that happens mid-drag; otherwise React paints
    // the last committed offsets and the image jumps back
    useLayoutEffect(syncLiveTransform)

    useEffect(() => () => {
        if (frameIdRef.current !== null) cancelAnimationFrame(frameIdRef.current)
    }, [])

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isEditing || !placement) return

        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)

        const x = transform?.X ?? 0
        const y = transform?.Y ?? 0

        dragRef.current = {
            pointerId: e.pointerId,
            clientX: e.clientX,
            clientY: e.clientY,
            originX: x,
            originY: y,
            x,
            y
        }
        setDragging(true)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== e.pointerId) return

        e.preventDefault()

        // Pointer coordinates are screen pixels and the card is CSS-scaled, so divide by the card
        // scale to get card pixels, then normalize against the frame
        const scale = cardScale || 1
        drag.x = drag.originX + (e.clientX - drag.clientX) / scale / frameWidth
        drag.y = drag.originY + (e.clientY - drag.clientY) / scale / frameHeight

        if (frameIdRef.current === null) {
            frameIdRef.current = requestAnimationFrame(() => {
                frameIdRef.current = null
                syncLiveTransform()
            })
        }
    }

    const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== e.pointerId) return

        if (frameIdRef.current !== null) {
            cancelAnimationFrame(frameIdRef.current)
            frameIdRef.current = null
        }
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId)
        }

        dragRef.current = null
        setDragging(false)

        if (drag.x !== drag.originX || drag.y !== drag.originY) {
            updateTransform({ X: drag.x, Y: drag.y })
        }
    }

    const loading = imgLoading || sizeLoading || !placement

    return (
        <Popover opened={isEditing} withArrow position="right">
            <Popover.Target>
                <div className="cc-image" data-dragging={dragging}
                     style={{ touchAction: isEditing ? "none" : undefined }}
                     onPointerDown={handlePointerDown}
                     onPointerMove={handlePointerMove}
                     onPointerUp={handlePointerEnd}
                     onPointerCancel={handlePointerEnd}>
                    {cardCustomization?.ArtSource &&
                        <Group gap="xs" c="white" className="cc-art-source">
                            <IconPaletteFilled/>
                            <Title order={5}>{cardCustomization?.ArtSource}</Title>
                        </Group>
                    }
                    <div className="cc-image-frame" ref={frameRef}>
                        {placement &&
                            <img className="cc-img" ref={imgRef} src={url} alt="" draggable={false}
                                 style={{
                                     width: `${placement.width.toFixed(2)}px`,
                                     height: `${placement.height.toFixed(2)}px`,
                                     transform: placementTransform(placement)
                                 }}/>
                        }
                    </div>
                    {loading && <Center className="cc-img-loader"><Loader/></Center>}
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack>
                    <Title order={3}>Card Image</Title>

                    <Stack>
                        <Group>
                            <ActionIcon.Group>
                                <Tooltip label="Zoom out" withinPortal>
                                    <ActionIcon onClick={() => updateTransform({
                                        Scale: clamp((transform?.Scale ?? 1) - ZOOM_STEP, MIN_SCALE, MAX_SCALE)
                                    })}>
                                        <IconZoomOut/>
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Reset zoom" withinPortal>
                                    <ActionIcon onClick={() => updateTransform({ Scale: 1 })}>
                                        <IconZoomReset/>
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Zoom in" withinPortal>
                                    <ActionIcon onClick={() => updateTransform({
                                        Scale: clamp((transform?.Scale ?? 1) + ZOOM_STEP, MIN_SCALE, MAX_SCALE)
                                    })}>
                                        <IconZoomIn/>
                                    </ActionIcon>
                                </Tooltip>
                            </ActionIcon.Group>
                            <Button leftSection={<IconFlipVertical/>}
                                onClick={() => updateTransform({
                                    Flipped: !(transform?.Flipped ?? false)
                                })}>Flip</Button>
                            <Button leftSection={<IconRestore/>}
                                onClick={() => updateTransform({
                                    X: undefined,
                                    Y: undefined
                                })}>Reset position</Button>
                        </Group>
                        <Flex justify="stretch" gap="md">
                            <ColorInput label="Accent color" w="100%"
                                defaultValue={build.Character.Colors.Mindscape}
                                value={cardCustomization?.AccentColor}
                                onChange={(val) => setCardCustomization?.({
                                    ...cardCustomization,
                                    AccentColor: val
                                })}/>
                            <TextInput label="Art Source" maxLength={32} w="100%"
                                disabled={cardCustomization?.CharacterImageUrl === undefined}
                                value={cardCustomization?.ArtSource}
                                onChange={(e) => setCardCustomization?.({
                                    ...cardCustomization,
                                    ArtSource: e.currentTarget.value
                                })}/>
                        </Flex>
                        <Dropzone 
                            className="drop-zone"
                            accept={IMAGE_TYPES}
                            onDrop={async (files) => {
                                const file = files[0]
                                console.log("Character image staged for preview", file.name)
                                setPendingImageFile(file)
                                // Marks that custom art exists so the Art Source input becomes enabled
                                setCardCustomization?.({
                                    ...cardCustomization,
                                    CharacterImageUrl: CUSTOM_IMAGE_MARKER
                                })
                            }}>
                            <DropzoneContent title="Drag or click to change the image" img={customImg}/>
                        </Dropzone>
                    </Stack>

                    <Flex gap="sm" justify="space-between">
                        <Button variant="light" color="orange" onClick={async () => {
                            setPendingImageFile(null)
                            setCardCustomization?.(undefined)
                            setLocalCustomization?.(build.Id, undefined)
                            await deleteSavedImage(owner.Uid, build.Id)
                            retry()
                        }}>Reset</Button>
                        <Group gap="xs">
                            <Button onClick={async () => {
                                let finalCustomization = cardCustomization
                                    ? { ...cardCustomization }
                                    : undefined

                                // Persist pending image if one was dropped
                                if (pendingImageFile && finalCustomization) {
                                    await saveImage(owner.Uid, build.Id, pendingImageFile)
                                    finalCustomization.CharacterImageUrl = CUSTOM_IMAGE_MARKER
                                    setCardCustomization?.(finalCustomization)
                                    setPendingImageFile(null)
                                }

                                setLocalCustomization?.(build.Id, finalCustomization)
                                setIsEditing?.(false)
                                retry()
                            }}>Save</Button>
                            <Button variant="subtle" onClick={() => {
                                // Discard pending image and restore previous customization
                                setPendingImageFile(null)
                                setCardCustomization?.(previousCustomizationRef.current)

                                setIsEditing?.(false)
                                retry()
                            }}>Cancel</Button>
                        </Group>
                    </Flex>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}
