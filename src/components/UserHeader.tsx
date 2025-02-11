import React, { useEffect, useRef, useState } from "react"
import { UserProfile } from "../api/UserProfile"
import { 
    BackgroundImage, 
    Card, 
    Stack, 
    Title, 
    Text, 
    Flex, 
    Avatar, 
    Loader, 
    Center,  
    Image as MantineImage,
    Group
} from "@mantine/core"
import "./UserHeader.css"

interface IUserHeaderProps {
    user: UserProfile
}

export default function UserHeader({ user }: IUserHeaderProps): React.ReactElement {
    const [textColor, setTextColor] = useState("white")
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    useEffect(() => {
        setImageSrc(null)
        const img = new Image()
        img.crossOrigin = "Anonymous" // Ensure cross-origin access
        img.src = user.Information.NamecardUrl

        img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const SAMPLE_SIZE = 128
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
    }, [user.Information.NamecardUrl])

    const UserData = () => {
        return (<>                                
            <Avatar src={user.Information.ProfilePictureUrl} size="xl" mr="sm" />
            <Stack align="flex-start" justify="flex-start" gap="0">
                <Group>
                    <Title order={2} style={{ color: textColor }}>{user.Information.Nickname}</Title>
                    <Text style={{ color: textColor }}>{user.Uid}</Text>
                </Group>
                <Group gap="sm">  
                    {
                        user.Information.Medals.map(m => {
                            return (
                                <MantineImage key={m.MedalType} src={m.MedalIcon.IconUrl} h="42px" />
                            )
                        })
                    }
                </Group>
            </Stack>
        </>)
    }

    return (
        <Card shadow="lg" radius="md">
            <Card.Section>
                    <BackgroundImage src={imageSrc ?? ""} className="img-vignette">
                        <Flex p="sm" align="center">
                            {
                                imageSrc === null 
                                    ? <Center w="100%"><Loader /></Center> 
                                    : UserData()
                            }
                        </Flex>
                    </BackgroundImage>
            </Card.Section>
        </Card>
    )
}