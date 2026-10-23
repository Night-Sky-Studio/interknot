import { Center, FloatingIndicator, Group, Stack, UnstyledButton } from "@mantine/core"
import AssaultLeaderboards from "./leaderboards/AssaultLeaderboards"
import Leaderboards from "./leaderboards/Leaderboards"
import { memo, useState } from "react"
import { IconTrophyFilled } from "@tabler/icons-react"

const tabs = [
    {
        icon: <IconTrophyFilled />,
        title: "Classic Leaderboards",
    },
    {
        icon: <div></div>, // TODO
        title: "Deadly Assault leaderboards"
    }
]

const LeaderboardsMemoized = memo(Leaderboards)
const AssaultLeaderboardsMemoized = memo(AssaultLeaderboards)

export default function LeaderboardsPage(): React.ReactElement {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({})
    const [active, setActive] = useState(0)
    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node
        setControlsRefs(controlsRefs)
    }

    const controls = tabs.map((item, idx) => (
        <UnstyledButton
            key={item.title}
            className="float-tab-control"
            size="xs"
            variant="transparent"
            ref={setControlRef(idx)}
            onClick={() => setActive(idx === active ? -1 : idx)}
            mod={{ active: active === idx }}>
            <Group className="float-tab-control-label">
                {item.icon}
                {item.title}
            </Group>
        </UnstyledButton>
    ))

    return (<>
        <title>Leaderboards | Inter-Knot</title>
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