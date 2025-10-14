import { Category } from '@/types/product'

interface CategoryCardProps {
    category: Category
    isCenterCard: boolean
}

export default function CategoryCard({ category, isCenterCard }: CategoryCardProps) {
    return (
        <div
            className={`transition-all duration-500 cursor-pointer  ${isCenterCard
                ? 'scale-110 hover:scale-120 shadow-2xl blur-0'
                : 'scale-90 hover:scale-110 blur-[2px] hover:blur-0'
                }`}
            style={{ flex: '1 0 auto', width: '280px' }}
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
}