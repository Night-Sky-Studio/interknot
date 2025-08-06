import { useParams } from "react-router"
import { UserHeaderMemorized } from "../components/UserHeader"
import { ActionIcon, Button, Group, Stack, Loader, Center, Collapse, Alert, Text, Tooltip, Modal, Stepper, Title, Kbd, PasswordInput, Progress } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { CharactersTableMemorized } from "../components/CharactersTable"
import { useEffect, useState } from "react"
import { useAsyncRetry, useSearchParam } from "react-use"
import { getMhyKey, getMhyStatus, getUser, getUserLeaderboards, initMhy } from "../api/data"
import { IconChevronDown, IconChevronUp, IconInfoCircle, IconReload, IconStar, IconStarFilled } from "@tabler/icons-react"
import Timer from "../components/Timer"
import "./styles/ProfilePage.css"
import { LeaderboardGridMemorized } from "../components/LeaderboardGrid"
import { Error as BackendError, LeaderboardProfile, Profile, ProfileInfo } from "@interknot/types"
import LeaderboardProvider from "../components/LeaderboardProvider"
import { useBackend } from "../components/BackendProvider"
import { useContextMenu } from "mantine-contextmenu"

export default function ProfilePage(): React.ReactElement {
    const { uid } = useParams()
    const initialOpenedId = useSearchParam("openedId")
    const backend = useBackend()
    const { showContextMenu } = useContextMenu()
    
    const [needsUpdate, setNeedsUpdate] = useState(false)
    const [savedUsers, setSavedUsers] = useLocalStorage<ProfileInfo[]>({ key: "savedUsers", defaultValue: [] })
    const [favoriteUsers, setFavoriteUsers] = useLocalStorage<number[]>({ key: "favoriteUsers", defaultValue: [] })
    const [profileBackup, setProfileBackup] = useState<Profile | null>(null)
    const [leaderboardsBackup, setLeaderboardsBackup] = useState<LeaderboardProfile | null>(null)

    const userState = useAsyncRetry(async () => {
        const result = await getUser(Number(uid), needsUpdate)
        setProfileBackup(result) // Store successful result as backup
        return result
    }, [uid, needsUpdate])

    const leaderboardsState = useAsyncRetry(async () => {
        if (!userState.value) {
            return undefined
        }
        const result = await getUserLeaderboards(Number(uid), needsUpdate)
        if (result) {
            setLeaderboardsBackup(result) // Store successful result as backup
        }
        return result
    }, [uid, userState.value, needsUpdate])

    const [opened, { toggle }] = useDisclosure(true)
    
    const toggleIsFavorite = () => {
        const userId = Number(uid)
        if (favoriteUsers.includes(userId)) {
            setFavoriteUsers(favoriteUsers.filter(u => u !== userId))
        } else {
            setFavoriteUsers([...favoriteUsers, userId])
        }
    }

    useEffect(() => {
        if (!savedUsers?.find(u => u.Uid.toString() === uid) && profileBackup) { 
            setSavedUsers([...savedUsers ?? [], { ...profileBackup.Information }])
        }
        setNeedsUpdate((profileBackup?.Ttl ?? 0) !== 0)
    }, [profileBackup])

    // Initialize backups when profile loads successfully
    useEffect(() => {
        if (profileBackup && !userState.error) {
            setProfileBackup(profileBackup)
        }
    }, [profileBackup, userState.error])

    useEffect(() => {
        if (leaderboardsState.value && !leaderboardsState.error) {
            setLeaderboardsBackup(leaderboardsState.value)
        }
        if (leaderboardsState.error) {
            toggle() // Collapse leaderboards on error
        }
    }, [leaderboardsState.value, leaderboardsState.error])

    useEffect(() => {
        if (profileBackup)
            console.log(`User ${profileBackup.Information.Uid}, TTL: ${profileBackup.Ttl}, needsUpdate: ${needsUpdate}, favoriteUsers: ${favoriteUsers.join(',')}`)
    }, [profileBackup, needsUpdate, favoriteUsers])

    const [openedId, setOpenedId] = useState<number | null>(initialOpenedId ? Number(initialOpenedId) : null)

    const errorHandler = (error: string) => {
        // try parse
        try {
            const parsedError = JSON.parse(error) as unknown as BackendError
            return `Error ${parsedError.Code}: ${parsedError.Message}\n${parsedError.Details}`
        } catch {
            return `Error: ${error}`
        }
    }

    const [mhyModalOpened, { open: mhyModalOpen, close: mhyModalClose }] = useDisclosure(false)
    const [mhyActiveStep, setMhyActiveStep] = useState(0)
    const nextStep = () => setMhyActiveStep((current) => (current < 3 ? current + 1 : current))
    const prevStep = () => setMhyActiveStep((current) => (current > 0 ? current - 1 : current))

    const [loginToken, setLoginToken] = useState("")
    const [loginId, setLoginId] = useState("")
    const [mhyProgress, setMhyProgress] = useState<number | undefined>(undefined)
    const [mhyProgressMsg, setMhyProgressMsg] = useState("Waiting for backend response...")

    return (<> 
        <Modal opened={mhyModalOpened} onClose={mhyModalClose} title="Import Characters from Battle Records" size="lg" centered>
            <Stepper active={mhyActiveStep} onStepClick={setMhyActiveStep} autoContrast>
                <Stepper.Step label="Disclaimer" description="Read carefully">
                    <Group>
                        <Title order={4}>BEFORE YOU CONTINUE</Title>
                        <Text>
                            This method is highly experimental and could compromise your account's security.
                            You'd need to provide us with your HoYoLab login token to access all of your characters.
                            This token <Text span fw="bold" c="white">will not be stored</Text> and <Text span fw="bold" c="white">will be
                            encrypted</Text> for it to be transferred to our backend server that will fetch your characters.
                        </Text>
                        <Text>
                            We are not responsible for any liabilities that may arise from using this feature.
                            If you do not agree with these terms, please close this window and do not proceed.
                        </Text>
                        <Text>
                            If you proceed, it would mean that you agree with these terms and understand all the 
                            risks associated with using this feature.
                        </Text>
                    </Group>
                    <Group justify="center" mt="xl">
                        <Button variant="default" onClick={mhyModalClose}>Cancel</Button>
                        <Button onClick={nextStep}>Next step</Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Step label="First step" description="Provide HoYoLab tokens">
                    <Group>
                        <Title order={4}>First step</Title>
                        <Text>
                            Please log into your HoYoLab account and open "Battle Records" for the first time to ensure the most fresh data.
                            Next, you will need to open <Text span fw="bold">DevTools</Text> (<Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + 
                            <Kbd>I</Kbd> or <Kbd>F12</Kbd>), navigate to <code>Application</code> tab, in the left sidebar select <code>Cookies</code>.
                            Next, in the table on the right, find <code>ltoken_v2</code> and <code>ltmid_v2</code>, copy their values and paste them 
                            into respective text fields bellow.
                        </Text>
                    </Group>
                    <PasswordInput
                        label="ltoken_v2"
                        withAsterisk
                        placeholder="v2_..."
                        value={loginToken}
                        onChange={(e) => setLoginToken(e.currentTarget.value)} />
                    <PasswordInput
                        label="ltmid_v2"
                        withAsterisk
                        placeholder="..._hy"
                        value={loginId}
                        onChange={(e) => setLoginId(e.currentTarget.value)} />
                    <Group justify="center" mt="xl">
                        <Button variant="default" onClick={prevStep}>Back</Button>
                        <Button onClick={async () => {
                            const str2ab = (str: string): ArrayBuffer => {
                                const buf = new Uint8Array(str.length)
                                for (let i = 0; i < str.length; i++) {
                                    buf[i] = str.charCodeAt(i)
                                }
                                return buf.buffer
                            }
                            const arrtob = (buffer: ArrayBuffer) => btoa(String.fromCharCode(...(new Uint8Array(buffer))))
                            nextStep()
                            const pem = await getMhyKey()
                            const binKey = str2ab(atob(
                                pem.replace(/-----.*?-----/g, "")
                                    .replace(/\n/g, "")
                            ))

                            const key = await window.crypto.subtle.importKey(
                                "spki", binKey,
                                { name: "RSA-OAEP", hash: "SHA-256" },
                                false, ["encrypt"]
                            )

                            const data = JSON.stringify({
                                uid: Number(uid),
                                ltoken_v2: loginToken,
                                ltmid_v2: loginId
                            })

                            const aesKey = await window.crypto.subtle.generateKey(
                                { name: "AES-GCM", length: 256 },
                                true,
                                ["encrypt", "decrypt"]
                            )
                            const iv = crypto.getRandomValues(new Uint8Array(12))
                            const encodedData = new TextEncoder().encode(data)

                            const encryptedDataAes = await crypto.subtle.encrypt(
                                { name: "AES-GCM", iv },
                                aesKey,
                                encodedData
                            )

                            const aesKeyExport = await crypto.subtle.exportKey("raw", aesKey)

                            const encryptedAesKey = await window.crypto.subtle.encrypt(
                                { name: "RSA-OAEP" },
                                key,
                                aesKeyExport
                            )

                            const payload = {
                                key: arrtob(encryptedAesKey),
                                iv: arrtob(iv.buffer),
                                data: arrtob(encryptedDataAes)
                            }
                            const statusUrl = await initMhy(payload)

                            setLoginId("")
                            setLoginToken("")

                            getMhyStatus(statusUrl, ({ msg, progress, status }) => {
                                setMhyProgressMsg(msg)
                                switch (status) {
                                    case "error":
                                        setMhyProgress(0)
                                        break
                                    case "success": 
                                        nextStep()
                                        setMhyProgressMsg("Done, refreshing the page...")
                                        setMhyProgress(100)

                                        setNeedsUpdate(true)

                                        setTimeout(() => window.location.reload(), 2000)
                                        break
                                    default: 
                                        setMhyProgress(progress ?? mhyProgress)
                                        break
                                }
                            })

                        }} disabled={!loginToken || !loginId}>Import characters</Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Step label="Processing" description="">
                    <Stack>
                        <Text>{mhyProgressMsg}</Text>
                        <Progress value={mhyProgress ?? 100} animated={mhyProgress === undefined} autoContrast />
                    </Stack>
                </Stepper.Step>
                <Stepper.Completed>
                    <Text>{mhyProgressMsg}</Text>
                    <Center><Loader /></Center>
                </Stepper.Completed>
            </Stepper>

        </Modal>

        {userState.loading && !profileBackup && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Center><Loader /></Center>
        </>}
        {userState.error && <>
            <title>{`${savedUsers.find(sp => sp.Uid === Number(uid))?.Nickname}'s Profile | Inter-Knot`}</title> 
            <Alert variant="light" color="red" title="Failed to load profile" icon={<IconInfoCircle />} mb="md">
                <Text ff="monospace">{errorHandler(userState.error.message)}</Text>
            </Alert>
        </>}
        {profileBackup && <>
            <title>{`${profileBackup?.Information.Nickname}'s Profile | Inter-Knot`}</title>
            <meta name="description" content={`${profileBackup?.Information.Nickname}'s Profile | Inter-Knot`} />
            <LeaderboardProvider>
                <Stack>
                    <Group justify="flex-end" gap="xs">
                        {backend.state && !backend.state.params.update_enabled && 
                            <Tooltip label={backend.state?.params.update_disabled_msg} withArrow portalProps={{ reuseTargetNode: true }}>
                                <Button rightSection={<IconReload />} disabled>Update</Button>
                            </Tooltip>
                        }
                        {backend.state && backend.state.params.update_enabled &&
                            <Button rightSection={<IconReload />} disabled={needsUpdate} onClick={() => {
                                setNeedsUpdate(true)
                                userState.retry()
                                leaderboardsState.retry()
                            }} onContextMenu={showContextMenu([
                                {
                                    key: "mhy",
                                    title: "Import all characters from Battle Records (Experimental)",
                                    onClick: mhyModalOpen
                                }
                            ])}>
                                <Timer key={uid} title="Update" isEnabled={needsUpdate}
                                    endTime={profileBackup.Ttl === 0 ? 60 : profileBackup.Ttl} 
                                    onTimerEnd={() => {
                                        setNeedsUpdate(false)
                                    }} />
                            </Button>
                        }
                        <ActionIcon onClick={toggleIsFavorite}>
                            { favoriteUsers.includes(Number(uid)) ? <IconStarFilled /> : <IconStar /> }
                        </ActionIcon>
                        <ActionIcon style={{ fontFamily: "shicon", fontSize: "1.5rem"}} 
                            component="a" href={`https://enka.network/zzz/${uid}`} target="_blank">
                            {""}
                        </ActionIcon>
                    </Group>
                    <Stack gap="0px" align="center">
                        <UserHeaderMemorized user={profileBackup.Information} showDescription={profileBackup.Information.Description !== ""} />
                        <Collapse in={opened} className="leaderboards" data-open={opened}>
                            {
                                leaderboardsState.loading && <Center m="md"><Loader /></Center>
                            }
                            {
                                leaderboardsBackup &&
                                    <LeaderboardGridMemorized 
                                        profile={leaderboardsBackup} 
                                        characters={profileBackup.Characters}
                                        onProfileClick={(agentId) => {
                                            setOpenedId(agentId === openedId ? null : agentId)
                                        }} />
                            }
                            {
                                leaderboardsState.error && <Center m="md">Failed to load leaderboards. Cause: {leaderboardsState.error.message}</Center>
                            }
                        </Collapse>
                        <Button variant="transparent" className="lb-expand-button" leftSection={opened ? <IconChevronUp /> : <IconChevronDown />} onClick={toggle}>
                            Leaderboards
                        </Button>
                    </Stack>
                    {profileBackup.Characters.length === 0 &&
                        <Center>
                            <Alert variant="light" color="blue" title="No characters data found!" icon={<IconInfoCircle />}
                                maw="50%">
                                <Text>
                                    If you're adding your profile to Inter-Knot for the first time, please check that your 
                                    <Text component="a" c="blue"
                                        href="https://zenless-zone-zero.fandom.com/wiki/Profile#:~:text=Agent%20Showcase%3A%20Showcase%20up%20to%206%20unlocked%20Agents%20and%20their%20current%20Level."
                                        target="_blank"> Agents Showcase</Text> is not empty and refresh your profile on Inter-Knot with <Text span c="blue">Update</Text> button.
                                </Text>
                            </Alert>
                        </Center>
                    }
                    {profileBackup.Characters.length !== 0 &&
                        <CharactersTableMemorized uid={profileBackup.Information.Uid} username={profileBackup.Information.Nickname} 
                            characters={profileBackup.Characters} lbAgents={leaderboardsState.value?.Agents} openedId={openedId} />
                    }
                </Stack>
            </LeaderboardProvider>
        </>
    }
    </>)
}