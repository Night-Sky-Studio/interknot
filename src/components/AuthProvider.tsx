import { Account } from "@interknot/types"
import React, { useEffect, useState } from "react"
import { notifications } from '@mantine/notifications'
import { IconLogout } from "@tabler/icons-react"
import { authenticate } from "@/api/auth"

export interface AuthContextType {
    account: Account | null
    loading: boolean
    logout: () => void
}

const defaultAuthContext: AuthContextType = {
    account: null,
    loading: false,
    logout: () => { }
}

const AuthContext = React.createContext(defaultAuthContext)

interface IAuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({ children }: IAuthProviderProps): React.ReactElement {
    const [account, setAccount] = useState<Account | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const logout = () => {
        setAccount(null)
    }

    useEffect(() => {
        setLoading(true)
        authenticate()
            .then((res) => {
                setAccount(res.data!)
            })
            .catch((err) => {
                const msg = (err.message as string).toLowerCase()
                if (msg.includes("session") || msg.includes("fetch")) {
                    console.error(err)
                    return
                }
                notifications.show({
                    title: "Failed to authenticate session.",
                    message: err.message,
                    color: "red",
                    autoClose: 5000,
                    icon: <IconLogout size={16} />,
                    position: "top-right",
                    top: 56
                })
                setAccount(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <AuthContext.Provider value={{ account: account, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}