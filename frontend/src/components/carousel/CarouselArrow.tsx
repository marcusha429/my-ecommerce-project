interface CarouselArrowProps {
    direction: 'left' | 'right'
    onClick: () => void
}

export default function CarouselArrow({ direction, onClick }: CarouselArrowProps) {
    return (
        <button
            onClick={onClick}
            className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all`}
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                />
            </svg>
        </button>
    )
}