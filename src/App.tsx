import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import theme from "./theme"
import Shell from "./components/Shell"
import { BrowserRouter, Route, Routes } from "react-router"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import ErrorPage from "./pages/ErrorPage"


export default function App() {
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark" 
            withStaticClasses withCssVariables withGlobalClasses>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Shell />}>
                            <Route index element={<HomePage />} />
                            <Route path="/user/:id" element={<ProfilePage />} />
                            <Route path="404" element={<ErrorPage />}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
        </MantineProvider>
    )
}
