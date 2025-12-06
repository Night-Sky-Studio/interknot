import React, { useState, useEffect } from "react"
import { BackendState, getStatus } from "../api/data"
import { IResult, match } from "@interknot/types"
import { getRarityIcon } from "./icons/Icons"

export interface BackendContextType {
    state: IResult<BackendState> | null
}

const BackendContext = React.createContext<BackendContextType>({
    state: null
})

interface IBackendProviderProps {
    children: React.ReactNode
    //checkInterval?: number
}

export function BackendProvider({ children/*, checkInterval = 5 * 60 * 1000*/ }: IBackendProviderProps): React.ReactElement {
    const [status, setStatus] = useState<IResult<BackendState> | null>(null)

    const fetchStatus = async () => {
        const result = await getStatus()

        // inject rarity icons
        result.data?.filters["Rarity"].forEach(v => {
            if (v.img === "") {
                v.img = match(v.value, [
                    ["2", getRarityIcon(2)],
                    ["3", getRarityIcon(3)],
                    ["4", getRarityIcon(4)],
                    () => ""
                ])
            }
        })

        return result
    }

    useEffect(() => {
        fetchStatus().then((result) => {
            setStatus(result)
        })
        // const interval = setInterval(fetchStatus, checkInterval)
        // return () => clearInterval(interval)
    }, [])

    return (
        <BackendContext.Provider value={{ state: status }}>
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