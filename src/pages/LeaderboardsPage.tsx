import { Center, FloatingIndicator, Group, Stack, UnstyledButton } from "@mantine/core"
import AssaultLeaderboards from "./leaderboards/AssaultLeaderboards"
import Leaderboards from "./leaderboards/Leaderboards"
import { memo, useState } from "react"
import { IconTrophy } from "@tabler/icons-react"
import { DeadlyAssaultOutline } from "@components/icons"
import { useMediaQuery } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router"

const tabs = [
    {
        icon: <IconTrophy />,
        title: "Classic Leaderboards",
        htmlTitle: "Leaderboards",
        path: "/leaderboards",
    },
    {
        icon: <DeadlyAssaultOutline height={24} />,
        title: "Deadly Assault Leaderboards",
        htmlTitle: "Deadly Assault Leaderboards",
        path: "/leaderboards/assault",
    }
]

const LeaderboardsMemoized = memo(Leaderboards)
const AssaultLeaderboardsMemoized = memo(AssaultLeaderboards)

export default function LeaderboardsPage(): React.ReactElement {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({})
    const location = useLocation()
    const navigate = useNavigate()
    const active = location.pathname.replace(/\/+$/, "") === tabs[1].path ? 1 : 0
    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node
        setControlsRefs(controlsRefs)
    }

    const isNarrow = useMediaQuery(`(max-width: 500px)`)

    const controls = tabs.map((item, idx) => (
        <UnstyledButton
            key={item.title}
            className="float-tab-control"
            size="xs"
            ref={setControlRef(idx)}
            onClick={() => navigate(item.path)}
            mod={{ active: active === idx }}
            title={item.title} 
            aria-label={item.title} aria-pressed={active === idx}>
            <Group className="float-tab-control-label">
                {item.icon}
                {(!isNarrow || active === idx) && item.title}
            </Group>
        </UnstyledButton>
    ))

    return (<>
        <title>{`${tabs[active].htmlTitle} | Inter-Knot`}</title>
        <Stack>
            <Center>
                <div className="float-tab-root" ref={setRootRef}>
                    { controls }

                    <FloatingIndicator
                        target={controlsRefs[active]}
                        parent={rootRef}
                        className="float-tab-indicator"
                    />
                </div>
            </Center>

            { active === 0 && <LeaderboardsMemoized /> }
            { active === 1 && <AssaultLeaderboardsMemoized /> }

        </Stack>
    </>)
}