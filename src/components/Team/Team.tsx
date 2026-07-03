import { LeaderboardTeamMember } from "@interknot/types"
import { Group, Image, Stack, Title, Tooltip } from "@mantine/core"
import "./Team.css"
import { useSettings } from "@components/SettingsProvider"
import { ProfessionIcon } from "../icons/Icons";

function EmptyMember({ compact = false }: { compact?: boolean }) {
    return <Title h="auto" order={compact ? 6 : 3} c="white">?</Title>
}

function MemberLevel({ level, weapon = false }: { level: number, weapon?: boolean }) {
    return (
        <div className="member-level">
            <Title h="auto" fz="50%" c="white">{weapon ? `P${level}` : `M${level}`}</Title>
        </div>
    )
}

function TeamMember({ member, compact = false }: { member: LeaderboardTeamMember, compact?: boolean }) {
    const { language, getLocalString } = useSettings()
    const agent = member.Character,
          mindscape = member.MindscapeLevel ?? 0,
          weapon = member.Weapon,
          weaponRefinement = member.WeaponRefinement ?? 1,
          set = member.DriveDiscSet,
          speciality = member.Speciality

    const tooltipText = agent 
        ? `${getLocalString(agent.Name ?? "")} (M${mindscape})`
        : speciality 
            ? `${speciality} agent`
            : "Any agent"

    return (
        <Group h="100%" wrap="nowrap" gap="0">
            <Tooltip label={tooltipText} portalProps={{ reuseTargetNode: true }}>
                <div className="member member-agent member-skew" style={{ zIndex: 1 }}>
                    {
                        speciality && <ProfessionIcon name={speciality} h="50%" />

                    }
                    {
                        agent && <> 
                            <Image h="100%" style={{ position: "relative" }}
                                src={agent.CircleIconUrl.replace("Circle", "Select")} alt={agent.Name} /> 
                            { !compact && mindscape > 0 && <MemberLevel level={mindscape} /> }
                        </>
                    }
                    {
                        !speciality && !agent && <EmptyMember compact={compact} />
                    }
                </div>
            </Tooltip>
            
            { !compact &&
                <Stack className="member-equipment" gap="0" justify="flex-end" h="100%">
                    {
                        weapon && 
                            <div className="member" style={{ height: "50%" }}
                                data-zzz-type="weapon" data-zzz-lang={language}
                                data-zzz-id={weapon.Id} data-zzz-level={60}
                                data-zzz-promote={6} data-zzz-index={weaponRefinement}>
                                <Image src={weapon.ImageUrl} alt={weapon.Name} />
                                { weaponRefinement > 1 && <MemberLevel weapon level={weaponRefinement} /> }
                            </div>
                    }
                    {
                        set && 
                            <div className="member" style={{ height: "50%" }}
                                data-zzz-type="artifact" data-zzz-lang={language}
                                data-zzz-level={4} data-zzz-id={set.Id}>
                                <Image p="4px" src={set.IconUrl} alt={set.Name} />
                            </div>
                    }
                </Stack>
            }
        </Group>
    )
}

export interface ITeamProps {
    team: LeaderboardTeamMember[]
    h?: string
    compact?: boolean
}

export function Team({ team, h, compact = false }: ITeamProps) {
    return (
        <Group gap={compact ? "2px" : "4px"} h={h ?? "32px"} wrap="nowrap" data-compact={compact}>
            {team.map((m, idx) => (
                <TeamMember key={m.Character?.Id ?? m.Speciality ?? `any-${idx}`} member={m} compact={compact} />
            ))}
            {Array.from({ length: 3 - team.length }, (_, i) => (
                <Tooltip key={i} label={"Any agent"} portalProps={{ reuseTargetNode: true }}>
                    <div className="member member-agent member-skew">
                        <EmptyMember compact={compact} />
                    </div>
                </Tooltip>
            ))}
        </Group>
    )
}