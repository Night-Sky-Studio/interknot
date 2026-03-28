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

const MAX_TIME = 9 * 3600 + 59 * 60 + 59

const Timer: React.FC<ITimerProps> = ({ title, endTime, elapsedTime, isEnabled, onTimerEnd }) => {
    const [currentTime, setCurrentTime] = useState(elapsedTime ?? 0)

    // no more than 9:59:59
    if (endTime > MAX_TIME) {
        throw new Error(`endTime can't be more than 9:59:59 (${MAX_TIME}s), was ${endTime}s`)
    }

    if (endTime < 0 || currentTime < 0) {
        throw new Error("Time value can't be negative")
    }

    function formatTime(time: number) {
        const hours = Math.floor(time / 3600)
        const hoursStr = hours > 0 ? `${hours}:` : ''
        const minutes = Math.floor((time % 3600) / 60)
        const seconds = time % 60
        return `${hoursStr}${minutes.toString()}:${seconds.toString().padStart(2, '0')}`
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