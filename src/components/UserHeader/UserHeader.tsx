import React, { memo } from "react"
import { match, Medal, ProfileInfo } from "@interknot/types"
import { 
    BackgroundImage, 
    Card, 
    Stack, 
    Title, 
    Avatar, 
    Center,  
    Image as MantineImage,
    Group,
    Loader
} from "@mantine/core"
import "./UserHeader.css"
import { useSettings } from "@components/SettingsProvider"

export function userServer(uid: string) {
        if (uid.length === 10) {
            return match(uid, [
                [id => id.startsWith("17"), () => "TW/HK"],
                [id => id.startsWith("13"), () => "ASIA"],
                [id => id.startsWith("15"), () => "EU"],
                [id => id.startsWith("10"), () => "NA"],
                () => "Unknown"
            ])
        } else {
            return match(uid, [
                [id => id.startsWith("3"), () => "CN"],
                [id => id.startsWith("2"), () => "CN"],
                [id => id.startsWith("1"), () => "CN"],
                [id => id.startsWith("0"), () => "Internal"],
                () => "Unknown"
            ])
        }
    }

export function ServerChip({ uid }: { uid: string }) {
    return (
        <Title order={6} className="user-info" w="7ch" ta="center">{userServer(uid)}</Title>
    )
}

interface IUserHeaderProps {
    user: ProfileInfo,
    showDescription?: boolean
}

export function UserHeader({ user, showDescription }: IUserHeaderProps): React.ReactElement {
    const { getLocalString } = useSettings()
    
    const Medal = ({ m }: { m: Medal }) => {
        return (
            <div className="namecard-medal">
                <MantineImage src={m.MedalIcon.IconUrl} alt={getLocalString(m.MedalIcon.Name)} h="42px" />
                <Title order={6} fz="10px" className="namecard-medal-level">{m.Value}</Title>
            </div>
        )
    }
    
    const UserData = () => {
        return (
            <Group className="user-data">         
                <Avatar className="namecard-avatar" src={user.ProfilePictureUrl} size="xl" mr="sm" />
                <Stack align="flex-start" justify="flex-start" gap="4px"
                    style={{ "--color-a": `#${user.Title?.ColorA ?? "FFFFFF"}`, "--color-b": `#${user.Title?.ColorB ?? "FFFFFF"}` }}>
                    <Title order={2} className="namecard-nickname" title={user.Nickname}>{user.Nickname}</Title>
                    {user.Title && 
                        <Center className="namecard-title">
                            <Title className="namecard-title" order={6}>
                                {getLocalString(user.Title.Text)}
                            </Title>
                        </Center>
                    }
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
                                    <Medal key={m.MedalType} m={m} />
                                )
                            })
                        }
                    </Group>
                </Stack>
            </Group>
        )
    }

    return (
        <Card shadow="lg" radius="md" w="100%">
            <Card.Section style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr", 
                gridTemplateRows: "1fr",
                borderRadius: "var(--mantine-radius-md)",
                boxShadow: "0 0 32px rgba(0 0 0 / 50%)"
            }}>
                <Center style={{ gridColumn: 1, gridRow: 1, zIndex: 0 }} ><Loader /></Center>
                <BackgroundImage radius="md" style={{ gridColumn: 1, gridRow: 1, zIndex: 1 }} src={user.NamecardUrl} className="background">
                    <UserData />
                </BackgroundImage>
            </Card.Section>
            {(showDescription ?? false) && 
                <Card.Section p="xs">
                    <Title order={6} className="namecard-description" title={user.Description}>{user.Description}</Title>
                </Card.Section>
            }
            
        </Card>
    )
}

export const UserHeaderMemorized = memo(UserHeader)