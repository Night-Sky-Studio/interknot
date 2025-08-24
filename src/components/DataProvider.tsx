import React from "react"

const DataContext = React.createContext<unknown>(null)

/**
 * A generic data provider component that uses React Context to pass data down the component tree.
 * This is useful for avoiding prop drilling when multiple nested components need access to the same data.
 */
export function DataProvider<T>({ children, data }: { children: React.ReactNode, data: T }): React.ReactElement {
    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    )
}

export function useData<T>(): T {
    const context = React.useContext(DataContext)
    if (!context) {
        throw new Error("useData must be used within a DataProvider")
    }
    return context as T
}