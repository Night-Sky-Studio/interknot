import { useAsyncRetry } from "react-use"
import { getLeaderboards } from "../api/data"
import { Card, Center, Group, Image, Loader, Stack, Table, Text, Alert, ActionIcon } from "@mantine/core"
import { BaseWeapon } from "@interknot/types"
import { ProfessionIcon, ZenlessIcon } from "../components/icons/Icons"
import { IconInfoCircle } from "@tabler/icons-react"
import { useNavigate } from "react-router"
import { getLocalString } from "../localization/Localization"
import { Team } from "../components/Team"

export default function LeaderboardsPage(): React.ReactElement {
    const navigate = useNavigate()

    const leaderboardsState = useAsyncRetry(async () => {
        return await getLeaderboards()
    })

    const WeaponButton = ({ id, weapon } : { id: number, weapon: BaseWeapon }) => {
        return (
            <ActionIcon variant="subtle" p="0" style={{ overflow: "visible" }}
                onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/leaderboards/${id}`)
                }}>
                <Image h="38px" src={weapon.ImageUrl} alt={getLocalString(weapon.Name)} />
            </ActionIcon>
        )
    }

    return (<>
        <title>Leaderboards | Inter-Knot</title>
        <Stack>
            <Alert variant="light" color="blue" 
                title="Leaderboards are meant for comparing Drive Discs strength only!" icon={<IconInfoCircle />}>
                <Stack>
                <Text>
                    Your mindscape, character, weapon levels and any other upgradable stats
                    are not taken into account when calculating the leaderboard score. Only the Drive Discs
                    and Drive Disc Sets are being used in the calculation.
                </Text>
                <Text>
                    Despite the score being directly related to the damage/daze dealt, it's VERY approximate,
                    should not be taken very seriously and must be treated as a number we pulled out of our asses.
                </Text>
                <Text>
                    You can check the calculations code we use on 
                    <Text c="blue" component="a" href="https://github.com/Night-Sky-Studio/interknot-calculator" target="_blank"> GitHub</Text>. Contributions are welcome!
                </Text>
                </Stack>
            </Alert>
            {leaderboardsState.loading && !leaderboardsState.error && 
                <Center>
                    <Loader />
                </Center>
            }
            {leaderboardsState.error &&
                <Alert variant="light" color="red" title="Failed to load leaderboards" icon={<IconInfoCircle />}>
                    <Text ff="monospace">Error: {leaderboardsState.error.message}</Text>
                </Alert>
            }
            {leaderboardsState.value &&
                <Card p="0" withBorder radius="md">
                    <Table stickyHeader>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Weapons</Table.Th>
                                <Table.Th>Team</Table.Th>
                                <Table.Th>Total</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {leaderboardsState.value.map((leaderboard, index) => {
                                return (
                                    <Table.Tr key={leaderboard.Id} onClick={() => {
                                        navigate(`/leaderboards/${leaderboard.Id}`)
                                    }}>
                                        <Table.Td>{index + 1}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <ZenlessIcon size={24} elementName={leaderboard.Character.ElementTypes[0]} />
                                                <ProfessionIcon size={24} name={leaderboard.Character.ProfessionType} />
                                                <Image h="32px" src={leaderboard.Character.CircleIconUrl} alt={leaderboard.Character.Name} />               
                                                {leaderboard.FullName}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <WeaponButton id={leaderboard.Id} weapon={leaderboard.Weapon} />
                                                {
                                                    leaderboard.Children.map((child) => (
                                                        <WeaponButton id={child.Id} weapon={child.Weapon} />
                                                    ))
                                                }
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Team team={[leaderboard.Character, ...leaderboard.Team]} />
                                        </Table.Td>
                                        <Table.Td>{leaderboard.Total}</Table.Td>
                                    </Table.Tr>
                                )
                            })}
                        </Table.Tbody>
                    </Table>
                </Card>
            }
        </Stack>
    </>)
}