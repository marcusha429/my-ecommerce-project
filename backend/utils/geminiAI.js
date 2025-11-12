const { GoogleGenerativeAI } = require('@google/generative-ai')

// Google Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

/**
 * Send a chat message to Gemini AI
 * @param {string} prompt - The complete prompt with context
 * @param {Object} options - Additional options
 * @returns {Promise<string>} AI response
 */
async function chatWithGemini(prompt, options = {}) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return text
    } catch (error) {
        console.error('Gemini AI Error:', error.message)
        throw new Error('Failed to get response from Gemini AI')
    }
}

/**
 * Get grocery/health recommendations from Gemini AI
 * @param {string} userMessage - User's question
 * @param {Object} userProfile - User's health profile
 * @returns {Promise<string>} AI recommendation
 */
async function getGroceryRecommendation(userMessage, userProfile = {}) {
    const systemContext = `You are a helpful AI assistant for a grocery e-commerce website.
You specialize in:
- Grocery product recommendations
- Meal planning and recipes
- Health-conscious food suggestions
- Dietary advice based on user's health conditions

User Profile:
${userProfile.conditions ? `Health Conditions: ${userProfile.conditions.join(', ')}` : 'None specified'}
${userProfile.allergies ? `Allergies: ${userProfile.allergies.join(', ')}` : 'None specified'}
${userProfile.dietaryPreferences ? `Dietary Preferences: ${userProfile.dietaryPreferences.join(', ')}` : 'None specified'}
${userProfile.goals ? `Goals: ${userProfile.goals.join(', ')}` : 'None specified'}

Keep responses concise, friendly, and focused on groceries/meals/health.
If asked about non-grocery topics, politely redirect to grocery-related questions.`

    const fullPrompt = `${systemContext}\n\nUser Question: ${userMessage}\n\nYour Response:`

    return await chatWithGemini(fullPrompt)
}

/**
 * Analyze shopping cart and suggest recipes
 * @param {Array} cartItems - Array of items in cart
 * @param {Array} availableProducts - All available products in database
 * @returns {Promise<Array>} Array of recipe suggestions
 */
async function analyzeCartForRecipes(cartItems, availableProducts = []) {
    const itemsList = cartItems.map(item => item.name).join(', ')

    const prompt = `You are a recipe expert. Analyze shopping carts and suggest practical, healthy recipes.

Cart Items: ${itemsList}

Task: Suggest 3 practical recipes using these items.

For each recipe, provide:
1. Recipe name
2. Brief description (1 sentence)
3. Which cart items are used
4. What additional items are needed (if any, max 3 items)
5. Difficulty level (Easy/Medium/Hard)
6. Cook time
7. Servings
8. Step-by-step instructions (5-7 steps)

IMPORTANT: Return ONLY a valid JSON array with this exact structure (no extra text before or after):
[
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "itemsInCart": ["item1", "item2"],
    "missingItems": [{"name": "item", "quantity": 1, "unit": "lb", "estimatedPrice": 3.99}],
    "difficulty": "Easy",
    "cookTime": "30 mins",
    "servings": 4,
    "instructions": ["step1", "step2", ...]
  }
]

Only suggest recipes where user has at least 50% of ingredients.`

    try {
        const response = await chatWithGemini(prompt)

        // Extract JSON from response (handle cases where AI adds explanation)
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
            console.error('No valid JSON found in Gemini response:', response)
            throw new Error('No valid JSON found in response')
        }

        const recipes = JSON.parse(jsonMatch[0])
        return recipes
    } catch (error) {
        console.error('Recipe analysis error:', error)
        // Return fallback empty array
        return []
    }
}

/**
 * Check if user's custom recipe is possible with cart items
 * @param {string} recipeName - Name of recipe user wants to make
 * @param {Array} cartItems - Items in user's cart
 * @returns {Promise<Object>} Analysis of what user has vs needs
 */
async function checkCustomRecipe(recipeName, cartItems) {
    const itemsList = cartItems.map(item => item.name).join(', ')

    const prompt = `You are a recipe expert. Check if recipes are possible with given ingredients.

User wants to make: "${recipeName}"
They have these items: ${itemsList}

Analyze:
1. Can they make this recipe with what they have?
2. What additional items do they need?
3. Provide brief recipe instructions

IMPORTANT: Return ONLY a valid JSON object (no extra text before or after):
{
  "recipeName": "${recipeName}",
  "canMake": true,
  "percentageComplete": 80,
  "itemsTheyHave": ["item1", "item2"],
  "missingItems": [{"name": "item", "quantity": 1, "unit": "lb", "estimatedPrice": 3.99}],
  "instructions": ["step1", "step2", "step3"],
  "cookTime": "30 mins",
  "servings": 4
}`

    try {
        const response = await chatWithGemini(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            console.error('No valid JSON found in Gemini response:', response)
            throw new Error('No valid JSON found in response')
        }
        return JSON.parse(jsonMatch[0])
    } catch (error) {
        console.error('Custom recipe check error:', error)
        return {
            recipeName,
            canMake: false,
            percentageComplete: 0,
            error: 'Unable to analyze recipe'
        }
    }
}

module.exports = {
    chatWithGemini,
    getGroceryRecommendation,
    analyzeCartForRecipes,
    checkCustomRecipe
}
