'use client'

import { useState } from 'react'
import ProductCard from '@/components/products/ProductCard'
import CategoryCard from '@/components/carousel/CategoryCard'
import CarouselArrow from '@/components/carousel/CarouselArrow'
import CarouselDots from '@/components/carousel/CarouselDots'
import { useProducts } from '@/hooks/useProduct'
import { useCarousel } from '@/hooks/useCarousel'
import { categories } from '@/constants/mockData'

export default function DashboardPage() {
    const { featuredProducts, trendingProducts } = useProducts()
    const { currentIndex, nextSlide, prevSlide, goToSlide, handleMouseEnter, handleMouseLeave } = useCarousel({
        itemCount: categories.length
    })

    return (
        <main>
            {/* New Arrivals Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    New Arrivals
                </h2>
                {featuredProducts.slice(0, 3).map((product, index) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        variant="featured"
                        index={index}
                    />
                ))}
            </section>

            {/* Trending Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Trending Now
                </h2>
                <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendingProducts.slice(0, 6).map((product, index) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            variant="trending"
                            index={index}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Carousel Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Shop by Category
                </h2>

                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <CarouselArrow direction="left" onClick={prevSlide} />
                    <CarouselArrow direction="right" onClick={nextSlide} />

                    {/* Carousel Container */}
                    <div className="overflow-hidden py-8 px-6 w-full">
                        <div className="flex items-center justify-center gap-2 w-full px-6">
                            {/* Show 7 cards: 3 left, current, 3 right */}
                            {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                                const index = (currentIndex + offset + categories.length) % categories.length
                                const category = categories[index]
                                const isCenterCard = offset === 0

                                return (
                                    <div
                                        key={`${category.id}-${offset}`}
                                        onClick={() => !isCenterCard && goToSlide(index)}
                                    >
                                        <CategoryCard
                                            category={category}
                                            isCenterCard={isCenterCard}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <CarouselDots
                        total={categories.length}
                        current={currentIndex}
                        onDotClick={goToSlide}
                    />
                </div>
            </section>
        </main>
    )
}