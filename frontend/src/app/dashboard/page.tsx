/*
┌─────────────────────────────────────────────┐
│ Header: Welcome [User] | Profile | Logout   │
├─────────────────────────────────────────────┤
│ Sidebar Nav     │ Main Content Area         │
│ - Dashboard     │ ┌─────────────────────┐   │
│ - Profile       │ │ Welcome Card        │   │
│ - Settings      │ └─────────────────────┘   │
│ - Analytics     │ ┌─────────┬─────────┐     │
│                 │ │ Quick   │ Recent  │     │
│                 │ │ Actions │ Activity│     │
│                 │ └─────────┴─────────┘     │
└─────────────────┴───────────────────────────┘*/

'use client';

import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth'

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  trending: boolean;
  stock: number;
  brand: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const categories = [
  {
    id: 1,
    name: 'Phones and Tablets',
    image: 'phones-tablets.jpg',
    description: 'Latest smartphones and tablets',
    bgColor: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    name: 'Video Games',
    image: 'video-games.jpg',
    description: 'Gaming consoles and accessories',
    bgColor: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    name: 'Electronics',
    image: 'electronics.jpg',
    description: 'Latest tech and gadgets',
    bgColor: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    name: 'Cameras',
    image: 'cameras.jpg',
    description: 'Professional photography gear',
    bgColor: 'from-red-500 to-red-600'
  },
  {
    id: 5,
    name: 'Accessories',
    image: 'accessories.jpg',
    description: 'Enhance your devices',
    bgColor: 'from-yellow-500 to-yellow-600'
  }
]

const gradients = [
  'from-slate-900 to-slate-700 text-white',
  'from-gray-100 to-gray-200 text-black',
  'from-purple-600 to-pink-600 text-white'
]

const primaryBtn = [
  'bg-blue-600 hover:bg-blue-700',
  'bg-black hover:bg-gray-800 text-white',
  'bg-white text-purple-600 hover:bg-gray-100',
]

const secondaryBtn = [
  'bg-white text-black hover:bg-gray-100',
  'bg-blue-600 hover:bg-blue-700 text-white',
  'bg-purple-800 hover:bg-purple-900'
]

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)



  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/featured')
      const data = await response.json()
      setNewArrivals(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/trending')
      const data = await response.json()
      const trendingOnly = data.filter((product: Product) => !product.featured)
      setTrendingProducts(trendingOnly)
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  // Carusel Auto Scroll
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === categories.length - 1 ? 0 : prevIndex + 1)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? categories.length - 1 : prevIndex - 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoScrolling(false) // Stop auto-scrolling on manual navigation
    setTimeout(() => setIsAutoScrolling(true), 10000) //resume after 10 seconds
  }

  useEffect(() => {
    fetchFeaturedProducts()
    fetchTrendingProducts()
  }, [])

  useEffect(() => {
    //get user data from local storage or API
    const checkAuth = async () => {
      //Uncomment the next line to view the Loading session
      //await new Promise (resolve => setTimeout(resolve, 2000))
      // const token = localStorage.getItem('accessToken')
      // //if no token -> redirect to signin
      // if (!token){
      //     window.location.href='auth/signin'
      //     return
      // }
      //otherwise, stop loading - TODO: later
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Auto-slide carousel every 5 seconds
  useEffect(() => {
    if (!isAutoScrolling) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, isAutoScrolling])


  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('accessToken');
      window.location.href = 'auth/signin';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        {/* Left side */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, User</p>
        </div>

        {/* Right side */}
        <div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john@example.com</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm cursor-pointer">
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="">
        {/* New Arrivals */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">New Arrivals</h2>

          {/* Loading & Products */}
          {isLoading ? (
            <div className='text-center py-8'>
              <p className='text-gray-600'>Loading Featured Products...</p>
            </div>
          ) : (
            newArrivals.slice(0, 3).map((product, index) => (
              <div
                key={product._id}
                className={`bg-gradient-to-r ${gradients[index % gradients.length]} rounded-3xl p-8 md:p-12 mb-6 overflow-hidden relative`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <h3 className="text-4xl md:text-6xl font-bold mb-4">{product.name}</h3>
                    <p className="text-xl mb-6 opacity-80">{product.description}</p>
                    <p className='text-2xl font-bold mb-4 text-green-400'>${product.price}</p>
                    <div className="flex gap-4">
                      <button className={`${primaryBtn[index % primaryBtn.length]} base`}>Learn More</button>
                      <button className={`${secondaryBtn[index % secondaryBtn.length]} base`}>Buy</button>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="w-80 h-80 bg-black bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <span className="opacity-60">{product.images} Image</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Trending Section*/}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Trending Now</h2>
          {/* Load Products */}iphone17.jpg

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            {trendingProducts.slice(0, 6).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <span className="text-gray-500">{product.images[0]}</span>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>
                  <div className='flex gap-4'>
                    <button className={`learnMore base`}>Learn More</button>
                    <button className={`buy base`}>Buy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Carousel*/}
        <section className='mb-12 px-6'>
          <h2 className='text-3xl font-bold text-center mb-8 text-gray-800'>Shop by Categories</h2>
          {/* Carousel Container */}
          <div className='relative max-w-7xl mx-auto'>
            {/* Left Arrow */}
            <button onClick={prevSlide} className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            {/* Right Arrow */}
            <button onClick={nextSlide} className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l 7 7-7 7'></path>
              </svg>
            </button>
            {/* Slides */}
            <div className='overflow-hidden py-8'>
              <div className='flex items-center justify-center'>
                {/*SHOW CARD*/}
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
            {/* Dots */}
            <div className='flex justify-center gap-2 mt-6'>
              {categories.map(
                (_, index) => (
                  <button key={index} onClick={() => goToSlide(index)}
                    className={`transition-all ${index === currentIndex
                      ? 'w-8 h-3 bg-blue-600'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'} rounded-full`}>
                  </button>
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
