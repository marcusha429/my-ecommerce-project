const { GoogleGenerativeAI } = require('@google/generative-ai')

// Lazy initialization to prevent crashes on import
let genAI = null

function getGenAI() {
    if (!genAI) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set')
        }
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    }
    return genAI
}

/**
 * Send a chat message to Gemini AI
 * @param {string} prompt - The complete prompt with context
 * @param {Object} options - Additional options
 * @returns {Promise<string>} AI response
 */
async function chatWithGemini(prompt, options = {}) {
    try {
        const ai = getGenAI()
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' })

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
    const availableProductsList = availableProducts.map(p => p.name).join(', ')

    const prompt = `You are an international recipe expert. Analyze shopping carts and suggest practical, delicious recipes from ANY cuisine (Asian, Western, Mediterranean, Latin, etc).

Cart Items: ${itemsList}

Available Products in Store (ONLY suggest these as missing items): ${availableProductsList}

Task: Suggest 3 practical recipes using these items. Think creatively about what dishes can be made with the available ingredients, regardless of cuisine type.

EXAMPLES OF WHAT YOU CAN SUGGEST:
- Asian: Fried Rice, Pho, Stir Fry, Noodle Soup, Spring Rolls
- Western: Pasta, Salad, Sandwiches, Grilled Dishes
- Mediterranean: Greek Salad, Hummus Bowls, Grilled Vegetables
- Latin: Tacos, Rice Bowls, Bean Dishes
- Simple: Soup, Scrambled Eggs, Roasted Vegetables

For each recipe, provide:
1. Recipe name (from any cuisine)
2. Brief description (1 sentence)
3. Which cart items are used (match EXACTLY with cart item names)
4. What additional items are needed - IMPORTANT: ONLY from "Available Products in Store" list
5. Difficulty level (Easy/Medium/Hard)
6. Cook time
7. Servings
8. Step-by-step instructions (5-7 steps)

CRITICAL RULES:
- Be FLEXIBLE and CREATIVE - combine ingredients to make tasty dishes from any cuisine
- ONLY suggest missing items that exist in the "Available Products in Store" list
- If you can't find exact traditional ingredients, adapt and suggest what IS available
- DO NOT suggest any ingredients not in the available products list
- If no missing items needed, set missingItems to empty array []
- ALWAYS suggest at least 2-3 recipes, even with limited ingredients
- Match cart item names EXACTLY as they appear in the list

IMPORTANT: Return ONLY a valid JSON array with this exact structure (no extra text before or after):
[
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "itemsInCart": ["exact cart item names"],
    "missingItems": [{"name": "exact product name from available list", "quantity": "1 cup", "estimatedPrice": 3.99}],
    "difficulty": "Easy",
    "cookTime": "30 mins",
    "servings": 4,
    "instructions": ["step1", "step2", ...]
  }
]

You MUST suggest at least 2 recipes. Be creative and flexible!`

    try {
        console.log('Analyzing cart with', cartItems.length, 'items and', availableProducts.length, 'available products')
        const response = await chatWithGemini(prompt)
        console.log('Raw Gemini response length:', response.length)

        // Extract JSON from response (handle cases where AI adds explanation)
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
            console.error('No valid JSON found in Gemini response:', response)
            throw new Error('No valid JSON found in response')
        }

        const recipes = JSON.parse(jsonMatch[0])
        console.log('Successfully parsed', recipes.length, 'recipes from AI')
        return recipes
    } catch (error) {
        console.error('Recipe analysis error:', error.message)
        console.error('Full error:', error)
        // Return fallback empty array
        return []
    }
}

/**
 * Check if user's custom recipe is possible with cart items
 * @param {string} recipeName - Name of recipe user wants to make
 * @param {Array} cartItems - Items in user's cart
 * @param {Array} availableProducts - All available products in database
 * @returns {Promise<Object>} Analysis of what user has vs needs
 */
async function checkCustomRecipe(recipeName, cartItems, availableProducts = []) {
    const itemsList = cartItems.map(item => item.name).join(', ')
    const availableProductsList = availableProducts.map(p => p.name).join(', ')

    const prompt = `You are a recipe expert. Check if recipes are possible with given ingredients.

User wants to make: "${recipeName}"
They have these items: ${itemsList}

Available Products in Store (ONLY suggest these as missing items): ${availableProductsList}

Analyze:
1. Can they make this recipe with what they have?
2. What additional items do they need? - IMPORTANT: ONLY suggest items from "Available Products in Store" list
3. Provide brief recipe instructions

CRITICAL RULES:
- ONLY suggest missing items that exist in the "Available Products in Store" list
- If an ingredient is not available in store, adapt the recipe or mark as "not fully possible"
- Use exact product names from the available products list

IMPORTANT: Return ONLY a valid JSON object (no extra text before or after):
{
  "recipeName": "${recipeName}",
  "canMake": true,
  "percentageComplete": 80,
  "itemsTheyHave": ["item1", "item2"],
  "missingItems": [{"name": "exact product name from available list", "quantity": "1 cup", "estimatedPrice": 3.99}],
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
