import { Category } from '@/types/product'
import Link from 'next/link'

interface CategoryCardProps {
    category: Category
    isCenterCard: boolean
}

export default function CategoryCard({ category, isCenterCard }: CategoryCardProps) {
    const cardContent = (
        <div
            className={`transition-all duration-500 cursor-pointer ${isCenterCard
                ? 'scale-110 z-10'
                : 'scale-95 opacity-60'
                }`}
            style={{ flex: '0 0 auto', width: '320px' }}
        >
            {/* Card container with conditional styling based on center position */}
            <div className={`
                rounded-2xl overflow-hidden shadow-lg
                ${isCenterCard
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl'
                    : 'bg-gradient-to-br from-emerald-100 to-emerald-200'
                }
                transition-all duration-500 h-96
            `}>
                {/* Image section - top half */}
                <div className="relative h-56 w-full overflow-hidden">
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Text section - bottom half */}
                <div className="p-6">
                    <h3 className={`text-2xl font-bold mb-2 ${isCenterCard ? 'text-white' : 'text-emerald-900'}`}>
                        {category.name}
                    </h3>
                    <p className={`text-sm ${isCenterCard ? 'text-white/90' : 'text-emerald-700'}`}>
                        {category.description}
                    </p>
                </div>
            </div>
        </div>
    )

    // Only wrap with Link if it's the center card
    if (isCenterCard) {
        return <Link href={`/category/${category.category}`}>{cardContent}</Link>
    }

    return cardContent
}