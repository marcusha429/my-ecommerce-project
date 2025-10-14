import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[]
    title: string
    emptyMessage?: string
}

export default function ProductGrid({
    products,
    title,
    emptyMessage = 'No products found'
}: ProductGridProps) {
    return (
        <div className='min-h-screen bg-white'>
            {/* Title */}
            <div className='max-w-7xl mx-auto px-4 md:px-6 py-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8'>{title}</h1>

                {/* Products */}
                {products.length === 0 ? (
                    <div className='text-center py-12'>
                        <p className='text-gray-500 text=lg'>{emptyMessage}</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                variant="trending"
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}