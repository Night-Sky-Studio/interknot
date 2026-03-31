import "./CharacterCard.css"
import "./CharacterImage.css"
import { useCardSettings } from "@components/CardSettingsProvider"
import {
    ActionIcon,
    BackgroundImage,
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
import React, { useEffect, useMemo, useRef, useState } from "react"
import { type CardCustomization, type Transform } from "@interknot/types"
import { useAsync, useAsyncRetry } from "react-use"
import { useBackend } from "@components/BackendProvider.tsx"

interface ICharacterImageProps {
    src: string
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif", "image/avif"]

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
        return URL.createObjectURL(file)
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
        // updateCardCustomization,
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

    // FIXME: needs proper img replacing solution
    // const { state } = useBackend()
    // const doro = useMemo(() => state?.data?.events?.doro ?? [], [state?.data?.events?.doro])
    // const doroMode = useMemo(() => doro.length > 0, [doro.length])
    const { state } = useBackend()
    const doro = useMemo(() => state?.data?.events?.doro ?? [], [state?.data?.events?.doro])
    const doroMode = useMemo(() => doro.length > 0, [doro.length])

    const adjustForDoro = (c?: CardCustomization) => {
        if (doroMode && doro.includes(build.Character.Id)) {
            console.log("doro mode")
            return c === undefined ? {
                CharacterTransform: {
                    Scale: 0.6
                }
            } : c
        }
    }

    // One-time init: load saved customization from localStorage
    const isInitialized = useRef(false)
    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        const c = getLocalCustomization?.(build.Id)
        setCardCustomization?.(adjustForDoro(c))
    }, [isInitialized, setCardCustomization, getLocalCustomization, build])

    // Doro override: apply scale whenever doroMode activates
    // useEffect(() => {
    //     if (!doroMode || !doro.includes(build.Character.Id)) return
    //
    //     updateCardCustomization?.((prev) => ({
    //         ...prev,
    //         CharacterTransform: {
    //             ...(prev?.CharacterTransform ?? {}),
    //             Scale: prev?.CharacterTransform?.Scale ?? 0.6
    //         }
    //     }))
    // }, [doroMode])

    const { value: savedImg, loading: imgLoading, retry } = useAsyncRetry(async () =>
        await getSavedImageUrl(owner.Uid, build.Id), [owner.Uid, build.Id])

    const fgTransform = cardCustomization?.CharacterTransform
    const fgImg = savedImg
    const fgRef = useRef<HTMLDivElement>(null)

    const { value: imgSize, loading: imgSizeLoading } = useAsync(async () => {
        const url = fgImg ?? src
        if (!url) return undefined

        const img = new Image()
        img.src = url
        await img.decode()
        return { width: img.naturalWidth, height: img.naturalHeight }
    }, [fgImg, src])

    const loading = useMemo(() => imgLoading || imgSizeLoading, [imgLoading, imgSizeLoading])

    const left = (imgRef: React.RefObject<HTMLDivElement | null>, t?: Transform) => {
        let offsetX = 0
        if (imgRef.current) {
            const width = imgSize?.width ?? 1
            const height = imgSize?.height ?? 1

            const parentWidth = imgRef.current.offsetWidth
            const parentHeight = imgRef.current.offsetHeight

            const scale = Math.max(parentWidth / width, parentHeight / height)
            const scaledWidth = width * scale * (t?.Scale ?? 1)

            offsetX = (parentWidth - scaledWidth) / 2
        } else {
            return "center"
        }

        return `left ${(offsetX + (t?.X ?? 0)).toFixed(2)}px`
    }
    const top = (t?: Transform) => `top ${(((t?.Y ?? 0) + 10) * (t?.Scale ?? 1)).toFixed(2)}px`

    const scale = (imgRef: React.RefObject<HTMLDivElement | null>, t?: Transform) => {
        if (!imgRef.current || !t) return "cover"

        const iw = imgSize?.width ?? 1
        const ih = imgSize?.height ?? 1

        const cw = imgRef.current.offsetWidth
        const ch = imgRef.current.offsetHeight

        const coverScale = Math.max(cw / iw, ch / ih)

        const finalScale = t?.Scale !== undefined
            ? coverScale * t.Scale   // apply user zoom
            : coverScale

        const percentX = (iw * finalScale) / cw * 100
        const percentY = (ih * finalScale) / ch * 100

        return `${percentX.toFixed(2)}% ${percentY.toFixed(2)}%`
    }

    const lastPos = useRef<{ x: number, y: number } | null>(null)

    const [imgPos, setImgPos] = useState({ left: "center", top: "top 10px", scale: "cover" })
    useEffect(() => {
        if (!state) {
            console.log("waiting for backend")
            return
        }
        if (!fgRef.current || !imgSize) return
        const fgTransform = cardCustomization?.CharacterTransform
        setImgPos({ left: left(fgRef, fgTransform), top: top(fgTransform), scale: scale(fgRef, fgTransform) })
    }, [fgRef.current, imgSize, cardCustomization?.CharacterTransform, state])

    const [active, setActive] = useState(false)

    useEffect(() => {
        const handleUp = () => setActive(false)
        window.addEventListener("mouseup", handleUp)
        return () => window.removeEventListener("mouseup", handleUp)
    }, [])

    return (
        <Popover opened={isEditing} withArrow position="right">
            <Popover.Target>
                <div className="cc-image cc-image-container"
                     style={{
                         userSelect: active ? "none" : "auto",
                         position: "relative"
                     }}
                     onMouseDown={(e) => {
                         if (!isEditing) return
                         e.preventDefault()
                         e.stopPropagation()

                         lastPos.current = { x: e.clientX, y: e.clientY }

                         setActive(true)
                     }}
                     onMouseMove={(e) => {
                         if (!active || !lastPos.current) return

                         e.preventDefault()
                         e.stopPropagation()

                         const target = e.currentTarget
                         const bounds = target.getBoundingClientRect()

                         const scaleF = cardScale ?? 1
                         const flipped = fgTransform?.Flipped ? -1 : 1
                         console.log(scaleF)

                         const mouseX = (e.clientX - lastPos.current.x) * scaleF * flipped,
                             mouseY = (e.clientY - lastPos.current.y) * scaleF

                         lastPos.current = { x: e.clientX, y: e.clientY }

                         if (bounds.left + mouseX < 0 || bounds.right + mouseX > window.innerWidth ||
                             bounds.top + mouseY < 0 || bounds.bottom + mouseY > window.innerHeight) {
                             setActive(false)
                             return
                         }

                         setCardCustomization?.({
                             ...cardCustomization,
                             CharacterTransform: {
                                 ...cardCustomization?.CharacterTransform,
                                 X: (fgTransform?.X ?? 0) + mouseX,
                                 Y: (fgTransform?.Y ?? 0) + mouseY
                             }
                         })
                     }}
                     onMouseUp={(e) => {
                         if (!isEditing) return
                         e.preventDefault()
                         e.stopPropagation()

                         lastPos.current = null
                         setActive(false)
                     }}>
                    {cardCustomization?.ArtSource &&
                        <Group gap="xs" c="white"
                               style={{ position: "absolute", bottom: "228px", right: "16px", zIndex: 500 }}>
                            <IconPaletteFilled/>
                            <Title order={5}>{cardCustomization?.ArtSource}</Title>
                        </Group>
                    }
                    {loading
                        ? <Center h="100%"><Loader/></Center>
                        : <BackgroundImage className="cc-img" ref={fgRef} src={fgImg ?? src}
                                           style={{
                                               "--img-x": imgPos.left,
                                               "--img-y": imgPos.top,
                                               "--img-scale": imgPos.scale,
                                               transform: fgTransform?.Flipped ? "scaleX(-1)" : undefined,
                                               filter: active ? "brightness(0.8)" : undefined
                                           } as React.CSSProperties}/>
                    }
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack>
                    <Title order={3}>Card Image</Title>

                    <Stack>
                        <Group>
                            <ActionIcon.Group>
                                <Tooltip label="Zoom out" withinPortal>
                                    <ActionIcon onClick={() => {
                                        setCardCustomization?.({
                                            ...cardCustomization,
                                            CharacterTransform: {
                                                ...fgTransform,
                                                Scale: (fgTransform?.Scale ?? 1) - 0.05
                                            }
                                        })
                                    }}>
                                        <IconZoomOut/>
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Reset zoom" withinPortal>
                                    <ActionIcon onClick={() => {
                                        setCardCustomization?.({
                                            ...cardCustomization,
                                            CharacterTransform: {
                                                ...fgTransform,
                                                Scale: 1
                                            }
                                        })
                                    }}>
                                        <IconZoomReset/>
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Zoom in" withinPortal>
                                    <ActionIcon onClick={() => {
                                        setCardCustomization?.({
                                            ...cardCustomization,
                                            CharacterTransform: {
                                                ...fgTransform,
                                                Scale: (fgTransform?.Scale ?? 1) + 0.05
                                            }
                                        })
                                    }}>
                                        <IconZoomIn/>
                                    </ActionIcon>
                                </Tooltip>
                            </ActionIcon.Group>
                            <Button leftSection={<IconFlipVertical/>}
                                    onClick={() => {
                                        setCardCustomization?.({
                                            ...cardCustomization,
                                            CharacterTransform: {
                                                ...fgTransform,
                                                Flipped: !(fgTransform?.Flipped ?? false)
                                            }
                                        })
                                    }}>Flip</Button>
                            <Button leftSection={<IconRestore/>} onClick={() => {
                                setCardCustomization?.({
                                    ...cardCustomization,
                                    CharacterTransform: {
                                        ...cardCustomization?.CharacterTransform,
                                        X: undefined,
                                        Y: undefined
                                    }
                                })
                            }}>Reset position</Button>
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
                        <Dropzone className="drop-zone"
                                  accept={IMAGE_TYPES}
                                  onDrop={async (files) => {
                                      const url = await saveImage(owner.Uid, build.Id, files[0])
                                      console.log("Character URL", url)
                                      setCardCustomization?.({ ...cardCustomization, CharacterImageUrl: url })
                                      retry()
                                  }}>
                            <DropzoneContent title="Drag or click to change the image" img={fgImg}/>
                        </Dropzone>
                    </Stack>

                    <Flex gap="sm" justify="space-between">
                        <Button variant="light" color="orange" onClick={async () => {
                            const root = await navigator.storage.getDirectory()

                            const characters = await root.getDirectoryHandle("characters", { create: true })
                            const userDir = await characters.getDirectoryHandle(`${owner.Uid}`, { create: true })
                            await userDir.removeEntry(`${build.Id}.png`).catch(() => {
                            })

                            setCardCustomization?.(undefined)
                            setLocalCustomization?.(build.Id, undefined)
                            await deleteSavedImage(owner.Uid, build.Id)
                            retry()
                            // setPos({ x: 0, y: 0 })
                        }}>Reset</Button>
                        <Group gap="xs">
                            <Button onClick={() => {
                                // setCardCustomization?.(currentCustomization)
                                setLocalCustomization?.(build.Id, cardCustomization)
                                setIsEditing?.(false)
                                retry()
                            }}>Save</Button>
                            <Button variant="subtle" onClick={() => {
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