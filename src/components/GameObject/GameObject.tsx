import { Group, Image, MantineColor, Text } from "@mantine/core"
import { useSettings } from "@components/SettingsProvider"
import "./GameObject.css"

export interface IGameObjectProps {
    img: string
    name: string
    size?: number
    bg?: MantineColor
}

export default function GameObject({ img, name, size, bg }: IGameObjectProps) {
    const { getLocalString } = useSettings()
    const s = size ?? 32
    return (
        <Group className="game-object" wrap="nowrap" gap="xs" m="0 0.5rem" p="0 0.5rem 0 0" bg={bg ?? "dark.8"}>
            <Image src={img} alt={getLocalString(name)} w={`${s}px`} h={`${s}px`} />
            <Text>{getLocalString(name)}</Text>
        </Group>
    )
}