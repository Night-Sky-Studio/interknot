import React, { useEffect, useRef, useState } from "react"
import { CharacterCardMemoized, ICharacterCardProps } from "./CharacterCard"
import { useElementSize } from "@mantine/hooks"
import { useCardSettings } from "../CardSettingsProvider"

interface ICharacterCardContainerProps {
    parentRef?: React.RefObject<HTMLDivElement | null>
    ref?: React.RefObject<HTMLDivElement | null>
    // children: typeof CharacterCard
    cardProps: ICharacterCardProps
}

export default function CharacterCardContainer({ parentRef, ref, cardProps }: ICharacterCardContainerProps): React.ReactElement {
    // const onlyChild = React.Children.only(children)
    // const Card = onlyChild as unknown as React.FC<ICharacterCardProps>
    const cardRef = useRef<HTMLDivElement>(null)

    const CARD_ASPECT_RATIO = 1 / 2
    const [cardScale, setCardScale] = useState(1)
    const [cardContainerHeight, setCardContainerHeight] = useState(750 * CARD_ASPECT_RATIO)
    const { ref: cardContainerRef, width } = useElementSize()
    const { context } = useCardSettings()
    const { showSubstatsBreakdown, setCardRef } = context || {}

    useEffect(() => {
        if (parentRef?.current) {
            cardContainerRef.current = parentRef?.current
        }
    }, [parentRef?.current, cardContainerRef])

    const SCALE_FACTOR_MIN = 0.56
    const MIN_HEIGHT = Math.trunc(1500 * CARD_ASPECT_RATIO * SCALE_FACTOR_MIN)
    // const MIN_WIDTH = Math.trunc(1500 * SCALE_FACTOR_MIN)

    useEffect(() => {
        let scaleFactor = (width - 40) / 1500
        scaleFactor = Math.min(Math.max(scaleFactor, SCALE_FACTOR_MIN), 1.05)

        let containerHeight = Math.round(width * CARD_ASPECT_RATIO) + (showSubstatsBreakdown ? 48 : 0)
        containerHeight = Math.max(containerHeight, MIN_HEIGHT + 67)

        // console.log(scaleFactor.toFixed(3), containerHeight, width)
        
        setCardScale(scaleFactor)
        setCardContainerHeight(containerHeight)
    }, [width, showSubstatsBreakdown])

    useEffect(() => {
        setCardRef?.(cardRef)
    }, [cardRef])
    
    return (
        <div ref={ref} style={{ "--scale": cardScale, height: `${cardContainerHeight - 64}px`, position: "relative" } as React.CSSProperties}>
            <CharacterCardMemoized ref={cardRef} {...cardProps} />
        </div>
    )
}