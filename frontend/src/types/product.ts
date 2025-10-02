export interface Product {
    _id: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    featured: boolean
    trending: boolean
    stock: number
    brand: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Category {
    id: number
    name: string
    image: string
    description: string
    bgColor: string
}