import { useState, useEffect } from 'react'

interface UseCarouselProps {
    itemCount: number
    autoScrollInterval?: number
    pauseDuration?: number
}

export function useCarousel({
    itemCount,
    autoScrollInterval = 5000,
    pauseDuration = 10000
}: UseCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoScrolling, setIsAutoScrolling] = useState(true)

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === itemCount - 1 ? 0 : prevIndex + 1
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? itemCount - 1 : prevIndex - 1
        )
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        setIsAutoScrolling(false)
        setTimeout(() => setIsAutoScrolling(true), pauseDuration)
    }

    // Auto-slide effect
    useEffect(() => {
        if (!isAutoScrolling) return

        const interval = setInterval(() => {
            nextSlide()
        }, autoScrollInterval)

        return () => clearInterval(interval)
    }, [currentIndex, isAutoScrolling, autoScrollInterval])

    return {
        currentIndex,
        nextSlide,
        prevSlide,
        goToSlide
    }
}