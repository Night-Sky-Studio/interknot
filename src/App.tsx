import "@mantine/core/styles.css"
import '@mantine/charts/styles.css'
import { MantineProvider } from "@mantine/core"
import theme from "./theme"
import Shell from "./components/Shell"
import { BrowserRouter, Route, Routes, useParams } from "react-router"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import ErrorPage from "./pages/ErrorPage"
import { SettingsProvider } from "./components/SettingsProvider"
import SettingsPage from "./pages/SettingsPage"
import LeaderboardsPage from "./pages/LeaderboardsPage"
import LeaderboardDetailPage from "./pages/LeaderboardDetailPage"

const ProfilePageWrapper = () => {
    const { uid } = useParams()
    return <ProfilePage key={uid} />
}

export default function App() {
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark" 
            withStaticClasses withCssVariables withGlobalClasses>
                <SettingsProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<Shell />}>
                                <Route index element={<HomePage />} />
                                <Route path="/user/:uid" element={<ProfilePageWrapper />} />
                                <Route path="*" element={<ErrorPage />}/>
                                <Route path="settings" element={<SettingsPage />}/>
                                <Route path="leaderboards" element={<LeaderboardsPage />} />
                                <Route path="leaderboards/:id" element={<LeaderboardDetailPage />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </SettingsProvider>
        </MantineProvider>
    )
}
