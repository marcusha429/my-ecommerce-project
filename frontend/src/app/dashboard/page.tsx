'use client';


import { useState, useEffect } from 'react'
import DashboardHeader from '@/components/layout/DashboardHeader'
import ProductCard from '@/components/products/ProductCard'
import CategoryCard from '@/components/carousel/CategoryCard'
import CarouselArrow from '@/components/carousel/CarouselArrow'
import CarouselDots from '@/components/carousel/CarouselDots'
import { useProducts } from '@/hooks/useProduct'
import { useCarousel } from '@/hooks/useCarousel'
import { categories } from '@/constants/mockData'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { featuredProducts, trendingProducts } = useProducts()
  const { currentIndex, nextSlide, prevSlide, goToSlide } = useCarousel({
    itemCount: categories.length
  })

  useEffect(() => {
    const checkAuth = async () => {
      // Uncomment to view loading session
      // await new Promise(resolve => setTimeout(resolve, 2000))

      // const token = localStorage.getItem('accessToken')
      // if (!token) {
      //   window.location.href = '/auth/signin'
      //   return
      // }

      setIsLoading(false)
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
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
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            {trendingProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                variant="trending"
              />
            ))}
          </div>
        </section>

        {/* Categories Carousel Section */}
        <section className="mb-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Shop by Category
          </h2>

          <div className="relative max-w-7xl mx-auto">
            <CarouselArrow direction="left" onClick={prevSlide} />
            <CarouselArrow direction="right" onClick={nextSlide} />

            {/* Carousel Container */}
            <div className="overflow-hidden py-8">
              <div className="flex items-center justify-center gap-4">
                {/* Show 3 cards: previous, current, next */}
                {[-2, -1, 0, 1, 2].map((offset) => {
                  const index = (currentIndex + offset + categories.length) % categories.length
                  const category = categories[index]
                  const isCenterCard = offset === 0

                  return (
                    <CategoryCard
                      key={`${category.id}-${offset}`}
                      category={category}
                      isCenterCard={isCenterCard}
                    />
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
    </div>
  )
}