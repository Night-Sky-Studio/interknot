import { Group } from "@mantine/core"
import { TooltipData } from "@components/CharacterCard/CharacterCard"
import { useData } from "@components/DataProvider"
import { useSettings } from "@components/SettingsProvider"
import * as CoreSkillIcons from "@icons/core"
import "./CoreSkill.css"

export default function CoreSkill({ level }: { level: number }): React.ReactElement {
    const isActive = (lvl: number): string => (lvl <= level) ? "var(--accent)" : "var(--mantine-color-dark-9)"

    const { language } = useSettings()
    const { charId } = useData<TooltipData>()

    return (
        <Group className="cc-core" gap="0px" justify="space-between" wrap="nowrap" style={{ position: "relative" }}
            data-zzz-lang={language} data-zzz-type="talent" data-zzz-id={charId} data-zzz-level={level} data-zzz-id-b="5">
            <div style={{ backgroundColor: isActive(2) }}><CoreSkillIcons.A fill="white" height="20px" /></div>
            <div style={{ backgroundColor: isActive(3) }}><CoreSkillIcons.B fill="white" height="20px" /></div>
            <div style={{ backgroundColor: isActive(4) }}><CoreSkillIcons.C fill="white" height="20px" /></div>
            <div style={{ backgroundColor: isActive(5) }}><CoreSkillIcons.D fill="white" height="20px" /></div>
            <div style={{ backgroundColor: isActive(6) }}><CoreSkillIcons.E fill="white" height="20px" /></div>
            <div style={{ backgroundColor: isActive(7) }}><CoreSkillIcons.F fill="white" height="20px" /></div>
        </Group>
    )
}