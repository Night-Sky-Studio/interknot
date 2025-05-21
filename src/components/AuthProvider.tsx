import { createContext, useContext } from "react"

interface IAuthContext {
    saveAccount: (account: any) => void
}

const defaultAuthContext: IAuthContext = {
    saveAccount: (account: any) => { console.log(account) } 
}

export const AuthContext = createContext(defaultAuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <AuthContext.Provider value={defaultAuthContext}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)