import React, { useState, useEffect } from "react"
import { BackendError, BackendState, getStatus } from "../api/data"

export interface BackendContextType {
    state: BackendState | null
    error: BackendError | null
}

const BackendContext = React.createContext<BackendContextType>({
    state: null,
    error: null
})

interface IBackendProviderProps {
    children: React.ReactNode
    //checkInterval?: number
}

export function BackendProvider({ children/*, checkInterval = 5 * 60 * 1000*/ }: IBackendProviderProps): React.ReactElement {
    const [status, setStatus] = useState<BackendState | null>(null)
    const [error, setError] = useState<BackendError | null>(null)

    const fetchStatus = async () => {
        try {
            const result = await getStatus()
            setStatus(result)
            setError(null)
            console.log("Data server status check", result)
        } catch (e: any) {
            const err = JSON.parse(e.message) as BackendError
            setError({
                code: 520,
                message: err.message
            })
            setStatus(null)
            console.error("Data server is offline", err)
        }
    }

    useEffect(() => {
        fetchStatus().then()
        // const interval = setInterval(fetchStatus, checkInterval)
        // return () => clearInterval(interval)
    }, [])

    return (
        <BackendContext.Provider value={{ state: status, error }}>
            {children}
        </BackendContext.Provider>
    )
}

export function useBackend(): BackendContextType {
    const context = React.useContext(BackendContext)
    if (!context) {
        throw new Error("useBackend must be used within a BackendProvider")
    }
    return context
}