import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import theme from "./theme"
import Shell from "./components/Shell"
import { BrowserRouter, Route, Routes, useParams } from "react-router"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import ErrorPage from "./pages/ErrorPage"

const ProfilePageWrapper = () => {
    const { uid } = useParams()
    return <ProfilePage key={uid} />
}

export default function App() {
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark" 
            withStaticClasses withCssVariables withGlobalClasses>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Shell />}>
                            <Route index element={<HomePage />} />
                            <Route path="/user/:uid" element={<ProfilePageWrapper />} />
                            <Route path="404" element={<ErrorPage />}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
        </MantineProvider>
    )
}
