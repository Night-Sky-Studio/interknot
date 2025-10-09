import React, { useEffect, useRef, useState } from "react"
import { CharacterCardMemoized, ICharacterCardProps } from "./CharacterCard"
import { useElementSize } from "@mantine/hooks"

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

    useEffect(() => {
        if (parentRef?.current) {
            cardContainerRef.current = parentRef?.current
        }
    }, [parentRef?.current, cardContainerRef])

    const SCALE_FACTOR_MIN = 0.5

    useEffect(() => {
        let scaleFactor = (width - 40) / 1500
        scaleFactor = Math.min(Math.max(scaleFactor, SCALE_FACTOR_MIN), 1.05)

        let containerHeight = Math.round(width * CARD_ASPECT_RATIO) // TODO: (isSubstatsVisible ? 48 : 0)
        containerHeight = Math.max(containerHeight, (1500 * CARD_ASPECT_RATIO * SCALE_FACTOR_MIN))

        setCardScale(scaleFactor)
        setCardContainerHeight(containerHeight)
    }, [width])

    return (
        <div ref={ref} style={{ "--scale": cardScale, height: `${cardContainerHeight - 64}px`, position: "relative" } as React.CSSProperties}>
            <CharacterCardMemoized ref={cardRef} {...cardProps} />
        </div>
    )
}