//USDA API helpers

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1'

export interface USDAFoodItem {
    fdcId: number
    description: string
    dataType: string
    brandOwner?: string
    foodNutrients: Array<{
        nutrientId: number
        nutrientName: string
        value: number
        unitName: string
    }>
}

export interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
}

// Search for food items by name
export async function searchFoods(query: string): Promise<USDAFoodItem[]> {
    try {
        const response = await fetch(
            `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10&dataType=Foundation,SR%20Legacy`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!response.ok) {
            throw new Error('Failed to search USDA database')
        }

        const data = await response.json()
        return data.foods || []
    } catch (error) {
        console.error('USDA search error:', error)
        return []
    }
}

// Get detailed food information by FDC ID
export async function getFoodDetails(fdcId: number): Promise<USDAFoodItem | null> {
    try {
        const response = await fetch(
            `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!response.ok) {
            throw new Error('Failed to get food details')
        }

        return await response.json()
    } catch (error) {
        console.error('USDA details error:', error)
        return null
    }
}

// Extract nutrition data from USDA food item
export function extractNutrition(foodItem: USDAFoodItem): NutritionData {
    const nutrients = foodItem.foodNutrients

    // Nutrient IDs from USDA database
    const NUTRIENT_IDS = {
        calories: 1008,  // Energy (kcal)
        protein: 1003,   // Protein
        carbs: 1005,     // Carbohydrates
        fat: 1004,       // Total lipid (fat)
        fiber: 1079      // Fiber, total dietary
    }

    const findNutrient = (id: number): number => {
        const nutrient = nutrients.find(n => n.nutrientId === id)
        return nutrient ? nutrient.value : 0
    }

    return {
        calories: findNutrient(NUTRIENT_IDS.calories),
        protein: findNutrient(NUTRIENT_IDS.protein),
        carbs: findNutrient(NUTRIENT_IDS.carbs),
        fat: findNutrient(NUTRIENT_IDS.fat),
        fiber: findNutrient(NUTRIENT_IDS.fiber)
    }
}