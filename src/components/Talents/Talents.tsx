import { Talents as CharacterTalents } from "@interknot/types"
import * as TalentIcons from "@icons/talents"
import { Group, Title } from "@mantine/core"
import { TooltipData } from "@components/CharacterCard/CharacterCard"
import { useData } from "@components/DataProvider"
import { useSettings } from "@components/SettingsProvider"
import "./Talents.css"

export default function Talents({ 
    talentLevels, 
    mindscapeLevel, 
    isRupture 
}: { 
    talentLevels: CharacterTalents, 
    mindscapeLevel: number, 
    isRupture: boolean 
}): React.ReactElement {
    // mindscapeLevel >= 5 ? 4 : mindscapeLevel >= 3 ? 2 : 0
    const mindscapeBoost = Math.floor(Math.min(mindscapeLevel, 6) / 2.5) * 2
    const { charId } = useData<TooltipData>()
    const { language } = useSettings()
    return (
        <Group className={`cc-talents ${mindscapeLevel > 2 ? "boosted" : ""}`} 
            gap="10px" justify="center" align="center" wrap="nowrap">
            <div className="cc-talent"
                data-zzz-lang={language} data-zzz-id={charId} 
                data-zzz-type="talent" data-zzz-id-b={0} data-zzz-level={talentLevels.BasicAttack + mindscapeBoost} >
                <TalentIcons.NormalAtk width="56px" />
                <Title order={6} className="cc-talent-level">{talentLevels.BasicAttack + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent"
                data-zzz-lang={language} data-zzz-id={charId} 
                data-zzz-type="talent" data-zzz-id-b={2} data-zzz-level={talentLevels.Dash + mindscapeBoost} >
                <TalentIcons.Dodge width="56px" />
                <Title order={6} className="cc-talent-level">{talentLevels.Dash + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent"
                data-zzz-lang={language} data-zzz-id={charId} 
                data-zzz-type="talent" data-zzz-id-b={6} data-zzz-level={talentLevels.Assist + mindscapeBoost} >
                <TalentIcons.Switch width="56px" />
                <Title order={6} className="cc-talent-level">{talentLevels.Assist + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent"
                data-zzz-lang={language} data-zzz-id={charId} 
                data-zzz-type="talent" data-zzz-id-b={1} data-zzz-level={talentLevels.SpecialAttack + mindscapeBoost} >
                { isRupture ? <TalentIcons.RuptureSkill width="56px" /> : <TalentIcons.Skill width="56px" /> }
                <Title order={6} className="cc-talent-level">{talentLevels.SpecialAttack + mindscapeBoost}</Title>
            </div>
            <div className="cc-talent"
                data-zzz-lang={language} data-zzz-id={charId} 
                data-zzz-type="talent" data-zzz-id-b={3} data-zzz-level={talentLevels.Ultimate + mindscapeBoost} >
                <TalentIcons.Ultimate width="56px" />
                <Title order={6} className="cc-talent-level">{talentLevels.Ultimate + mindscapeBoost}</Title>
            </div>
        </Group>
    )
}
