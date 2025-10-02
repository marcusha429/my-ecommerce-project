import { Product } from '@/types/product'
import { gradients, primaryBtn, secondaryBtn } from '@/constants/style'

interface ProductCardProps {
    product: Product
    variant?: 'featured' | 'trending'
    index?: number
}

export default function ProductCard({
    product,
    variant = 'trending',
    index = 0
}: ProductCardProps) {

    if (variant === 'featured') {
        return (
            <div className={`bg-gradient-to-r ${gradients[index % gradients.length]} rounded-3xl p-8 md:p-12 mb-6 overflow-hidden relative`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <h3 className="text-4xl md:text-6xl font-bold mb-4">{product.name}</h3>
                        <p className="text-xl mb-6 opacity-80">{product.description}</p>
                        <p className="text-2xl font-bold mb-4 text-green-400">${product.price}</p>
                        <div className="flex gap-4">
                            <button className={`${primaryBtn[index % primaryBtn.length]} px-8 py-3 rounded-full font-semibold transition-colors`}>
                                Learn More
                            </button>
                            <button className={`${secondaryBtn[index % secondaryBtn.length]} px-8 py-3 rounded-full font-semibold transition-colors`}>
                                Buy
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="w-80 h-80 bg-black bg-opacity-20 rounded-2xl flex items-center justify-center">
                            <span className="opacity-60">{product.images} Image</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Trending variant
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <span className="text-gray-500">{product.images[0]}</span>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>
                <div className="flex gap-4">
                    <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                        Learn More
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                        Buy
                    </button>
                </div>
            </div>
        </div>
    )
}