import { useCallback, useState } from "react"
import { useAsyncRetry } from "react-use"
import { notifications } from "@mantine/notifications"
import { IconAlertCircle, IconCheck } from "@tabler/icons-react"
import { Account } from "@interknot/types"
import { cancelProfileClaim, getProfileClaim, initProfileClaim, ProfileClaim } from "@api/data"
import { ApiError, errorMessage } from "@api/error"

export interface UseProfileClaim {
    /** In-progress claim for this profile and account, if there is one. */
    claim: ProfileClaim | undefined
    /** The claim lookup is in flight. */
    loading: boolean
    /** An init or cancel request is in flight. */
    busy: boolean
    /** The claim lookup failed. "No claim in progress" is not an error. */
    error: Error | undefined
    /** Re-read the claim state from the backend. */
    refresh: () => void
    /** Start a claim. Returns false and notifies the user when it fails. */
    init: () => Promise<boolean>
    /** Cancel the in-progress claim. Returns false and notifies the user when it fails. */
    cancel: () => Promise<boolean>
}

/**
 * Owns the profile binding claim state for a single profile: looking up the
 * in-progress claim, starting one, and cancelling one.
 *
 * Every request re-reads the claim afterward, whatever its outcome, since a
 * claim can also disappear server-side once it completes or expires.
 */
export function useProfileClaim(uid: number | undefined, account: Account | null): UseProfileClaim {
    const { retry, ...state } = useAsyncRetry(async () => {
        if (!uid || !account) return undefined
        try {
            return await getProfileClaim(uid)
        } catch (error) {
            // Having no claim in progress is a normal state, not a failure
            if (error instanceof ApiError && error.status === "E_NOT_FOUND") return undefined
            throw error
        }
    // Keyed on the account id, not the object: refreshing the account hands back
    // an equal-but-new Account, which would otherwise re-run this lookup
    }, [uid, account?.Id])

    const [busy, setBusy] = useState(false)

    const run = useCallback(async (
        request: (uid: number) => Promise<unknown>,
        errorTitle: string,
        successMessage?: string
    ): Promise<boolean> => {
        if (!uid || busy) return false

        setBusy(true)
        try {
            await request(uid)
            if (successMessage) {
                notifications.show({
                    message: successMessage,
                    color: "blue",
                    autoClose: 4000,
                    icon: <IconCheck size={16} />,
                    position: "bottom-center"
                })
            }
            return true
        } catch (error) {
            notifications.show({
                title: errorTitle,
                message: errorMessage(error),
                color: "red",
                icon: <IconAlertCircle size={16} />,
                position: "bottom-center"
            })
            return false
        } finally {
            setBusy(false)
            retry()
        }
    }, [uid, busy, retry])

    return {
        claim: state.value?.data,
        loading: state.loading,
        busy,
        error: state.error,
        refresh: retry,
        init: () => run(initProfileClaim,
            "Failed to start profile binding. Please try again later or contact us if the issue persists."),
        cancel: () => run(cancelProfileClaim,
            "Failed to cancel ongoing claim. Please try again later or contact us if the issue persists.",
            "Ongoing claim cancelled")
    }
}
