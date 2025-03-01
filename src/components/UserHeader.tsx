import React, { memo, useEffect, useState } from "react"
import { ProfileInfo } from "@interknot/types"
import { 
    BackgroundImage, 
    Card, 
    Stack, 
    Title, 
    Text, 
    Avatar, 
    Center,  
    Image as MantineImage,
    Group,
    Loader
} from "@mantine/core"
import "./styles/UserHeader.css"
import { getLocalString } from "../localization/Localization"

interface IUserHeaderProps {
    user: ProfileInfo
}

export function UserHeader({ user }: IUserHeaderProps): React.ReactElement {
    const [textColor, setTextColor] = useState("white")
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    useEffect(() => {
        setImageSrc(null)
        const img = new Image()
        img.crossOrigin = "Anonymous" // Ensure cross-origin access
        img.src = user.NamecardUrl

        img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const SAMPLE_SIZE = 64
            canvas.width = SAMPLE_SIZE // img.width
            canvas.height = SAMPLE_SIZE // img.height
            ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)

            const imageData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
            let totalLuminance = 0
            const pixels = imageData.data

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i]
                const g = pixels[i + 1]
                const b = pixels[i + 2]
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b
                totalLuminance += luminance
            }

            const avgLuminance = totalLuminance / (pixels.length / 4)
            setTextColor(avgLuminance > 128 ? "black" : "white")

            // Convert the canvas to a Blob URL and set it as the image source
            setImageSrc(img.src)
        }
    }, [user.NamecardUrl])

    const UserData = () => {
        const userServer = (uid: string) => {
            switch (true) {
                case uid.startsWith("17"): return "TW/HK/MO"
                case uid.startsWith("13"): return "ASIA"
                case uid.startsWith("15"): return "EU"
                case uid.startsWith("10"): return "NA"
                case uid.startsWith("3"): return "CN"
                case uid.startsWith("2"): return "CN"
                case uid.startsWith("1"): return "CN"
                case uid.startsWith("0"): return "Internal"
                default: return "Unknown"
            }
        }

        return (
            <Group className="user-data">         
                <Avatar src={user.ProfilePictureUrl} size="xl" mr="sm" />
                <Stack align="flex-start" justify="flex-start" gap="4px"
                    style={{ "--color-a": `#${user.Title.ColorA}`, "--color-b": `#${user.Title.ColorB}` }}>
                    <Title order={2} style={{ color: textColor }}>{user.Nickname}</Title>
                    <Center className="namecard-title">
                        <Title className="namecard-title" order={6}>
                            {getLocalString(user.Title.Text)}
                        </Title>
                    </Center>
                    <Text style={{ color: textColor }}>{user.Description}</Text>
                </Stack>
                <Stack className="user-achievements" align="flex-end" justify="flex-start" gap="4px">
                    <Group gap="4px">
                        <Title className="user-info" order={6}>{userServer(user.Uid.toString())}</Title>
                        <Title className="user-info" order={6}>IL {user.Level}</Title>
                    </Group>
                    <Group gap="sm" h="42px">
                        {
                            user.Medals.map(m => {
                                return (
                                    <MantineImage key={m.MedalType} src={m.MedalIcon.IconUrl} h="42px" />
                                )
                            })
                        }
                    </Group>
                </Stack>
            </Group>
        )
    }

    return (
        <Card shadow="lg" radius="md">
            <Card.Section style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr", 
                gridTemplateRows: "1fr" 
            }}>
                    { imageSrc === null && <Center style={{ gridColumn: 1, gridRow: 1, zIndex: 0 }} ><Loader /></Center> }
                    <BackgroundImage style={{ gridColumn: 1, gridRow: 1, zIndex: 100 }} src={imageSrc ?? ""} className="background">
                        <UserData />
                    </BackgroundImage>
            </Card.Section>
        </Card>
    )
}

export const UserHeaderMemorized = memo(UserHeader)