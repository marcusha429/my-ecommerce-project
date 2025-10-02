'use client'

import { useCarousel } from '@/hooks/useCarousel'
import { categories } from '@/constants/mockData'

export default function CategoryCarousel() {
    const { currentIndex, nextSlide, prevSlide, goToSlide } = useCarousel({
        itemCount: categories.length
    })

    return (
        <section className="mb-12 px-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Shop by Category
            </h2>

            {/* Carousel Container */}
            <div className="relative max-w-7xl mx-auto">
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Slides Container */}
                <div className="overflow-hidden py-8">
                    <div className="flex items-center justify-center gap-4">
                        {/* Show 3 cards: previous, current (centered & larger), next */}
                        {[-1, 0, 1].map((offset) => {
                            const index = (currentIndex + offset + categories.length) % categories.length
                            const category = categories[index]
                            const isCenterCard = offset === 0

                            return (
                                <div
                                    key={category.id}
                                    className={`transition-all duration-500 ${isCenterCard
                                        ? 'scale-100 md:scale-110 opacity-100 z-10'
                                        : 'scale-75 md:scale-90 opacity-50'
                                        } hover:scale-105 md:hover:scale-115 cursor-pointer`}
                                    style={{ flex: '0 0 auto', width: '280px' }}
                                >
                                    <div className={`bg-gradient-to-br ${category.bgColor} rounded-2xl p-6 h-80 flex flex-col justify-between shadow-xl`}>
                                        <div>
                                            <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-white opacity-90 text-sm">{category.description}</p>
                                        </div>
                                        <div className="bg-white bg-opacity-20 rounded-xl h-32 flex items-center justify-center">
                                            <span className="text-white text-sm opacity-75">{category.image}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {categories.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all ${index === currentIndex
                                ? 'w-8 h-3 bg-blue-600'
                                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                } rounded-full`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}