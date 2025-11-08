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
    unit: string
    weight?: number
    expirationDate?: string
    organic?: string
    nutrition?: {
        calories?: number
        protein?: number
        carbs?: number
        fat?: number
        fiber?: number
    }
}

export interface Category {
    id: number
    name: string
    category: string
    image: string
    description: string
    bgColor: string
}