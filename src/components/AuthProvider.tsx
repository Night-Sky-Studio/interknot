import { Account } from "@interknot/types"
import React, { useCallback, useEffect, useState } from "react"
import { notifications } from '@mantine/notifications'
import { IconLogout } from "@tabler/icons-react"
import { authenticate } from "@/api/auth"

export interface AuthContextType {
    account: Account | null
    loading: boolean
    logout: () => void
    /** Re-read the account, e.g. after its claimed profiles have changed. */
    refresh: () => void
}

const defaultAuthContext: AuthContextType = {
    account: null,
    loading: false,
    logout: () => { },
    refresh: () => { }
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

    /** `silent` keeps a background refresh from flashing the account button into a loader. */
    const load = useCallback(async (silent: boolean = false) => {
        if (!silent) setLoading(true)
        try {
            const res = await authenticate()
            setAccount(res.data!)
        } catch (err) {
            const msg = ((err as Error).message).toLowerCase()
            if (msg.includes("session") || msg.includes("fetch")) {
                console.error(err)
                return
            }
            notifications.show({
                title: "Failed to authenticate session.",
                message: (err as Error).message,
                color: "red",
                autoClose: 5000,
                icon: <IconLogout size={16} />,
                position: "top-right",
                top: 56
            })
            // Keep the account already in hand on a background refresh:
            // a one-off failure shouldn't look like being logged out
            if (!silent) setAccount(null)
        } finally {
            if (!silent) setLoading(false)
        }
    }, [])

    useEffect(() => {
        void load()
    }, [load])

    const refresh = useCallback(() => {
        void load(true)
    }, [load])

    return (
        <AuthContext.Provider value={{ account: account, loading, logout, refresh }}>
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