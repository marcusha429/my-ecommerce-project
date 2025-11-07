interface CarouselDotsProps {
    total: number
    current: number
    onDotClick: (index: number) => void
}

export default function CarouselDots({ total, current, onDotClick }: CarouselDotsProps) {
    return (
        <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: total }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={`transition-all ${index === current
                            ? 'w-8 h-3 bg-emerald-600'
                            : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                        } rounded-full`}
                />
            ))}
        </div>
    )
}