import { Flex } from "@mantine/core"
import { useAsync } from "react-use"
import { useMemo } from "react"
import { getDriveDiscs } from "@/api/data"
import "@components/cells/styles/CritCell.css"
import "@components/cells/styles/WeaponCell.css"
import "./styles/TestPage.css"
import DriveDiscCard from "@/components/DriveDiscCard/DriveDiscCard"

export default function TestPage() {
    // const { getLocalString, getLevel } = useSettings()
    const uid = Number(1500278107)

    const driveDiscsState = useAsync(async () => {
        return await getDriveDiscs({ limit: 40 })
    }, [uid])

    const driveDiscs = useMemo(() => driveDiscsState.value?.data ?? [], [driveDiscsState.value?.data])

    return <Flex wrap="wrap" gap="10px">
        {driveDiscs.map(dd =><DriveDiscCard key={dd.Uid} disc={dd} />)}
    </Flex>
}