import { SkillTag } from "@interknot/types"

export const getTag = (tag: unknown): SkillTag => {
    if (typeof tag === "number") {
        return SkillTag[tag] as unknown as SkillTag
    }
    return tag as SkillTag
}
