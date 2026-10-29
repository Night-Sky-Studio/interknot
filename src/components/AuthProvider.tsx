import { Account } from "@interknot/types"
import React, { useCallback, useEffect, useState } from "react"
import { notifications } from '@mantine/notifications'
import { IconLogout } from "@tabler/icons-react"
import { authenticate } from "@/api/auth"
import { ApiError } from "@api/error"

export interface AuthContextType {
    account: Account | null
    loading: boolean
    logout: () => void
    /**
     * Re-read the account, e.g. after its claimed profiles have changed.
     * Resolves false when the account could not be read.
     */
    refresh: () => Promise<boolean>
}

const defaultAuthContext: AuthContextType = {
    account: null,
    loading: false,
    logout: () => { },
    refresh: async () => false
}

/**
 * A missing or rejected session is the answer, not a failure to read it: the
 * account is genuinely gone. Anything else — offline, DNS, 5xx — leaves the
 * account unknown rather than absent.
 */
function isSessionAnswer(err: unknown): boolean {
    return err instanceof ApiError && (err.status === "E_SESSION" || err.status === "E_AUTH")
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

    /**
     * Reads the account once. `silent` keeps a background refresh from flashing the
     * account button into a loader, and from dropping an account that is still
     * perfectly usable.
     */
    const load = useCallback(async (silent: boolean = false): Promise<boolean> => {
        if (!silent) setLoading(true)
        try {
            const res = await authenticate()
            setAccount(res.data!)
            return true
        } catch (err) {
            console.error(err)
            if (isSessionAnswer(err)) {
                setAccount(null)
                return false
            }
            // A refresh follows something the user just did, so its failure has to be
            // visible: the page is now showing stale account state. The account itself
            // is kept — a failed read is not a logout.
            if (silent) {
                notifications.show({
                    title: "Failed to refresh your account.",
                    message: `${(err as Error).message}. Reload the page to try again.`,
                    color: "red",
                    autoClose: 5000,
                    icon: <IconLogout size={16} />,
                    position: "top-right",
                    top: 56
                })
            } else {
                setAccount(null)
            }
            return false
        } finally {
            if (!silent) setLoading(false)
        }
    }, [])

    useEffect(() => {
        void load()
    }, [load])

    const refresh = useCallback(() => load(true), [load])

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