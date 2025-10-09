import { UnstyledButton, Center, Stack, Group, Button, FloatingIndicator, Modal, Dialog, Title, Switch, Drawer, Popover, Flex, ActionIcon } from "@mantine/core"
import { IconCross, IconTools, IconX } from "@tabler/icons-react"
import { useState } from "react"
import BuildInfo from "../BuildInfo/BuildInfo"
import "./CardFooter.css"
import { useDisclosure } from "@mantine/hooks"

const data = ["Damage distribution", "Sub-stat priority", "Leaderboards"]

export default function CardFooter({ uid, characterId }: { uid: number, characterId: number }): React.ReactElement {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({})
    const [active, setActive] = useState(-1)
    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node
        setControlsRefs(controlsRefs)
    };

    const controls = data.map((item, index) => (
        <UnstyledButton
            key={item}
            className="control"
            size="xs"
            variant="transparent"
            ref={setControlRef(index)}
            onClick={() => setActive(index === active ? -1 : index)}
            mod={{ active: active === index }}
            disabled={index === 1}
            data-disabled={index === 1 ? true : undefined}>
            <span className="controlLabel">{item}</span>
        </UnstyledButton>
    ))

    const [opened, { open, close }] = useDisclosure(false)

    return (<>
        {/* <Drawer opened={opened} onClose={close} position="bottom" 
            offset={8} size="xs" withCloseButton shadow="xl">
            <Stack>
                <Title order={3}>Card Customization</Title>
                <Switch label="Substats breakdown" />
            </Stack>
        </Drawer> */}
        
        <Center w="100%">
            <Stack w="100%" maw="100%">
                <Group>
                    <Popover opened={opened} withArrow position="top" shadow="0px 0px 32px rgba(0 0 0 / 75%)"
                        transitionProps={{ transition: "pop" }}
                        closeOnClickOutside={false} closeOnEscape={false}>
                        <Popover.Target>
                            <Button leftSection={<IconTools />} onClick={open}>Card Customization</Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack>
                                <Flex justify="space-between" align="center" w="384px">
                                    <Title order={3}>Card Customization</Title>
                                    <ActionIcon variant="subtle" onClick={close}><IconX /></ActionIcon>
                                </Flex>
                                <Switch label="Substats breakdown" />
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                    <div className="root" ref={setRootRef}>
                        {controls}

                        <FloatingIndicator
                            target={controlsRefs[active]}
                            parent={rootRef}
                            className="indicator"
                        />
                    </div>
                </Group>
                {active !== -1 &&
                    <BuildInfo uid={uid} characterId={characterId} mode={active} />
                }
            </Stack>
        </Center>
    </>)
}