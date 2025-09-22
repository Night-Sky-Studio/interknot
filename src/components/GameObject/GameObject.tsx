import { Group, Image, MantineColor, Text } from "@mantine/core"
import { useSettings } from "@components/SettingsProvider"
import "./GameObject.css"
import { ZenlessIcon } from "../icons/Icons"

export interface IGameObjectProps {
    img?: string
    propId?: number
    name: string
    size?: number
    bg?: MantineColor
}

export default function GameObject({ img, propId, name, size, bg }: IGameObjectProps) {
    const { getLocalString } = useSettings()
    const s = size ?? 32
    return (
        <Group className="game-object" wrap="nowrap" gap="xs" m="0 0.5rem" p="0 0.5rem 0 0" bg={bg ?? "dark.8"}>
            { img && <Image src={img} alt={getLocalString(name)} w={`${s}px`} h={`${s}px`} /> }
            { propId && <ZenlessIcon size={s / 1.5} style={{ margin: "0.25rem", marginLeft: "0.5rem" }} id={propId} />}
            <Text>{getLocalString(name)}</Text>
        </Group>
    )
}