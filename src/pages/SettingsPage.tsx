import { Card, Stack, Title, Text, Group, SegmentedControl, useCombobox, Select, Switch, Modal, Flex, Button } from "@mantine/core"
import { useSettings } from "../components/SettingsProvider"
import { AvailableLocs } from "../localization/Localization"
import { useDisclosure } from "@mantine/hooks"
import GameObject from "@/components/GameObject/GameObject"
import { IconPlus, IconX } from "@tabler/icons-react"

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

    const [opened, { open, close }] = useDisclosure(false)

    return (<>
        <title>Settings | Inter-Knot</title>

        <Modal opened={opened} onClose={close} size="lg" centered
            overlayProps={{
                backgroundOpacity: 0.5,
                blur: 8,
            }}
            closeOnClickOutside={false} closeOnEscape={false}
            title={<Title order={3}>Enable Crit Value?</Title>}>
            <Stack>
                <Text>Crit value <Text component="span" fw={900}>SHOULD NOT</Text> be used to rank anything.</Text>
                <Group gap="4px">
                    Crit Value formula: <GameObject propId={20103} name="Crit" /><IconX size="16px" />2<IconPlus size="16px" /><GameObject propId={21103} name="CritDmg" />
                </Group>
                <Text>
                    By enabling it, you acknowledge that you understand what it is, what it is could be used for 
                    and give your explicit consent <Text component="span" fw={900}>NOT</Text> to use it for ranking 
                    purposes and <Text component="span" fw={900}>NOT</Text> base your decisions around it.
                </Text>
                <Flex justify="space-evenly" gap="md">
                    <Button onClick={close} fullWidth>Cancel</Button>
                    <Button variant="subtle" fullWidth onClick={() => {
                        settings.setCvEnabled(true)
                        close()
                    }}>Enable Crit Value</Button>
                </Flex>
            </Stack>
        </Modal>

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
                <Switch label="Crit Value Enabled"
                        checked={settings.cvEnabled}
                        onChange={() => {
                            settings.setCvEnabled(false)
                            if (!settings.cvEnabled) open()
                        }} />
            </Stack>
        </Card>
    </>)
}