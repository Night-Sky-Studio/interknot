import { Card, Stack, Title, Text, Group, SegmentedControl, useCombobox, Select } from "@mantine/core"
import { Unit, Units, useSettings } from "../components/SettingsProvider"
import { AvailableLocs } from "../localization/Localization"

export default function SettingsPage() {
    const settings = useSettings()
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption()
    })

    return (<>
        <title>Settings | Inter-Knot</title>
        <Card m="lg" p="lg">
            <Stack gap="lg">
                <Title>Settings</Title>
                <Group gap="sm">
                    <Text>Language:</Text>
                    <Select data={AvailableLocs} value={settings.language} 
                        onChange={(val) => {
                            if (!val)
                                throw new Error("Language is null?????")
                            settings.setLanguage(val)
                        }} />
                </Group>
                <Group gap="sm">
                    <Text>Current artifact unit:</Text>
                    <SegmentedControl data={Units} value={settings.units} onChange={(val) => {
                        settings.setUnits(val as Unit)
                    }}></SegmentedControl>
                </Group>
                <Group gap="sm">
                    <Text>TOP% decimal places:</Text>
                    <SegmentedControl data={["0", "1", "2", "3"]} 
                        value={settings.decimalPlaces.toString()} onChange={(val) => {
                        settings.setDecimalPlaces(Number(val))
                    }}></SegmentedControl>
                </Group>
            </Stack>
        </Card>
    </>)
}