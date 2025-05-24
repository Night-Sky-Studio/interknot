import { Account } from "@interknot/types"
import { createContext, useContext, useState } from "react"
import { useAsync } from "react-use"
import { authenticate } from "../api/auth"
import { AsyncState } from "react-use/lib/useAsyncFn"

interface IAuthContext {
    account?: AsyncState<Account>
    session?: string
    setSession: (session: string) => void
}

const defaultAuthContext: IAuthContext = {
    account: undefined,
    session: undefined,
    setSession: () => { }
}

export const AuthContext = createContext(defaultAuthContext)

/// thanks @mimee
// function getSessionFromCookie() {
//     if (!document.cookie) return ""
//     const params = new URLSearchParams(document.cookie.replace(/; /g, "&"))
//     const cookies = Object.fromEntries(params.entries())
//     return cookies.session || ""
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // when session changes, we need to update the account
    const [context, setContext] = useState<IAuthContext>(defaultAuthContext)

    const setSession = (session: string) => setContext((prev) => ({ ...prev, session }))

    const account = useAsync(async () => {
        return await authenticate()
    }, [context.session])
    
    return <AuthContext.Provider value={{ ...context, account, setSession }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)