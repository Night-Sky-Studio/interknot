import React from "react"

const DataContext = React.createContext<unknown>(null)

/**
 * A generic data provider component that uses React Context to pass data down the component tree.
 * This is useful for avoiding prop drilling when multiple nested components need access to the same data.
 */
export function DataProvider<T>({ children, data }: { children: React.ReactNode, data: T }): React.ReactElement {
    const ctx = React.useContext(DataContext) as T | undefined

    type extended = T & typeof ctx

    if (ctx) {
        data = { ...ctx, ...data } as extended
    }

    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    )
}

export function useData<T>(): T {
    return React.useContext(DataContext) as T
}