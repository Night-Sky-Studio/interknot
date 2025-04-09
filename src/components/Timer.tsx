import { useState, useEffect } from "react"

/**
 * Timer props
 */
export interface ITimerProps {
    title: string
    endTime: number
    elapsedTime?: number
    isEnabled: boolean
    onTimerEnd?: () => void
}

const Timer: React.FC<ITimerProps> = ({ title, endTime, elapsedTime, isEnabled, onTimerEnd }) => {
    const [currentTime, setCurrentTime] = useState(elapsedTime ?? 0)

    if (endTime > 3599) {
        throw new Error("endTime can't be more than 59:59 (3599 seconds)")
    }

    if (endTime < 0 || currentTime < 0) {
        throw new Error("Time value can't be negative")
    }

    function formatTime(time: number) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        let interval: number

        if (isEnabled) {
            interval = setInterval(() => {
                setCurrentTime(prevTime => prevTime + 1)
            }, 1000) as unknown as number
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isEnabled])

    useEffect(() => {
        if (currentTime === endTime) {
            onTimerEnd?.()
        }
        if (currentTime > endTime) {
            console.warn(`currentTime (${currentTime}) is more than endTime (${endTime}). Resetting to zero.`)
            setCurrentTime(0)
        }
    }, [currentTime, endTime])

    return (
        <span>{isEnabled ? formatTime(endTime - currentTime) : title}</span>
    )
}

export default Timer