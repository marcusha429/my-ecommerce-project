import { Category } from '@/types/product'

export const categories: Category[] = [
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