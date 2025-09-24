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

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState('');

  const newArrivals = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Titanium. So strong. So Light. So Pro.',
      bgGradient: 'from-slate-900 to-slate-700',
      textColor: 'text-white',
      primaryBtn: 'bg-blue-600 hover:bg-blue-700',
      secondaryBtn: 'bg-white text-black hover:bg-gray-100'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      description: 'Mind-blowing. Head-turning.',
      bgGradient: 'from-gray-100 to-gray-200',
      textColor: 'text-black',
      primaryBtn: 'bg-black hover:bg-gray-800 text-white',
      secondaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 3,
      name: 'AirPods Pro',
      description: 'Adaptive Audio. Now playing.',
      bgGradient: 'from-purple-600 to-pink-600',
      textColor: 'text-white',
      primaryBtn: 'bg-white text-purple-600 hover:bg-gray-100',
      secondaryBtn: 'bg-purple-800 hover:bg-purple-900'
    }
  ];

  const trendingProducts = [
    { id: 1, name: 'iPad Pro', price: '$999', image: 'iPad Image' },
    { id: 2, name: 'Apple Watch', price: '$399', image: 'Watch Image' },
    { id: 3, name: 'AirPods Max', price: '$549', image: 'AirPods Image' },
    { id: 4, name: 'Mac Studio', price: '$1999', image: 'Mac Image' },
    { id: 5, name: 'iPhone 14', price: '$799', image: 'iPhone Image' },
    { id: 6, name: 'HomePod', price: '$299', image: 'HomePod Image' }
  ];

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

          {/* Products */}
          {newArrivals.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className={`bg-gradient-to-r ${product.bgGradient} ${product.textColor} rounded-3xl p-8 md:p-12 mb-6 overflow-hidden relative`}>
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <h3 className="text-4xl md:text-6xl font-bold mb-4">{product.name}</h3>
                  <p className="text-xl mb-6 opacity-80">{product.description}</p>
                  <div className="flex gap-4">
                    <button className={`${product.primaryBtn} base`}>Learn More</button>
                    <button className={`${product.secondaryBtn} base`}>Buy</button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-80 h-80 bg-black bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="opacity-60">{product.name} Image</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Trending Section*/}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Trending Now</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            {trendingProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <span className="text-gray-500">{product.image}</span>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4">{product.price}</p>
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
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Shop by Category</h2>
        </section>
      </main>
    </div>
  );
}
