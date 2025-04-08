import { Card, Stack, Title, Text, Group, SegmentedControl, useCombobox, Select } from "@mantine/core"
import { useSettings } from "../components/SettingsProvider"
import { AvailableLocs } from "../localization/Localization"

export default function SettingsPage() {
    const settings = useSettings()
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption()
    })

    const localeMap: Record<string, string> = {
        "zh-tw": "🇹🇼 繁體中文",
        "zh-cn": "🇨🇳 简体中文",
        "de": "🇩🇪 Deutsch", 
        "en": "🇺🇸 English",
        "es": "🇪🇸 Español",
        "fr": "🇫🇷 Français",
        "id": "🇮🇩 Bahasa Indonesia",
        "ja": "🇯🇵 日本語",
        "ko": "🇰🇷 한국어",
        "pt": "🇵🇹 Português",
        "ru": "🇷🇺 Русский",
        "th": "🇹🇭 ภาษาไทย",
        "vi": "🇻🇳 Tiếng Việt"
    }

    return (<>
        <title>Settings | Inter-Knot</title>
        <Card p="lg">
            <Stack gap="lg">
                <Title>Settings</Title>
                <Group gap="sm">
                    <Text>Language:</Text>
                    <Select data={AvailableLocs.map(l => {
                        return {
                            label: localeMap[l],
                            value: l
                        }
                    })} value={settings.language} 
                        onChange={(val) => {
                            if (!val)
                                throw new Error("Language is null?????")
                            settings.setLanguage(val)
                        }} />
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