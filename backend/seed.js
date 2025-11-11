const mongoose = require('mongoose')
const Product = require('./models/Product')
require('dotenv').config()

const groceryProducts = [
    // FRESH PICKS (Top Pick)
    {
        name: 'Organic Bananas',
        description: 'Fresh organic bananas from local farms, perfectly ripe and sweet',
        price: 0.79,
        category: 'fruits-vegetables',
        brand: 'Farm Fresh',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500'],
        toppick: true,
        popular: false,
        unit: 'lb',
        organic: true,
        nutrition: {
            calories: 89,
            protein: 1.1,
            carbs: 23,
            fat: 0.3,
            fiber: 2.6
        }
    },
    {
        name: 'Hass Avocados',
        description: 'Creamy Hass avocados, perfect for guacamole and salads',
        price: 1.99,
        category: 'fruits-vegetables',
        brand: 'California Fresh',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500'],
        toppick: true,
        popular: true,
        unit: 'piece',
        organic: true,
        nutrition: {
            calories: 160,
            protein: 2,
            carbs: 8.5,
            fat: 15,
            fiber: 7
        }
    },
    {
        name: 'Organic Strawberries',
        description: 'Sweet, juicy organic strawberries picked at peak ripeness',
        price: 4.99,
        category: 'fruits-vegetables',
        brand: 'Berry Best',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500'],
        toppick: true,
        popular: true,
        unit: 'lb',
        organic: true,
        nutrition: {
            calories: 32,
            protein: 0.7,
            carbs: 7.7,
            fat: 0.3,
            fiber: 2
        }
    },

    // POPULAR ITEMS (Trending)
    {
        name: 'Organic Whole Milk',
        description: 'Farm-fresh organic whole milk from grass-fed cows',
        price: 5.99,
        category: 'dairy-eggs',
        brand: 'Organic Valley',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500'],
        toppick: false,
        popular: true,
        unit: 'gallon',
        organic: true,
        nutrition: {
            calories: 149,
            protein: 7.7,
            carbs: 11.7,
            fat: 7.9,
            fiber: 0
        }
    },
    {
        name: 'Free-Range Chicken Breast',
        description: 'Hormone-free, antibiotic-free chicken breast from local farms',
        price: 8.99,
        category: 'meat-seafood',
        brand: "Butcher's Choice",
        stock: 30,
        images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'],
        toppick: false,
        popular: true,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6,
            fiber: 0
        }
    },
    {
        name: 'Artisan Sourdough Bread',
        description: 'Freshly baked artisan sourdough with crispy crust',
        price: 6.49,
        category: 'bakery',
        brand: 'Daily Bread',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500'],
        toppick: false,
        popular: true,
        unit: 'piece',
        organic: true,
        nutrition: {
            calories: 260,
            protein: 9,
            carbs: 50,
            fat: 2,
            fiber: 2
        }
    },
    {
        name: 'Organic Eggs',
        description: 'Cage-free organic eggs from local farms',
        price: 6.99,
        category: 'dairy-eggs',
        brand: 'Happy Hens',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'],
        toppick: false,
        popular: true,
        unit: 'dozen',
        organic: true,
        nutrition: {
            calories: 72,
            protein: 6,
            carbs: 0.4,
            fat: 5,
            fiber: 0
        }
    },
    {
        name: 'Wild-Caught Salmon',
        description: 'Fresh Alaskan wild-caught salmon fillet',
        price: 14.99,
        category: 'meat-seafood',
        brand: 'Ocean Harvest',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=500'],
        toppick: false,
        popular: true,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 206,
            protein: 22,
            carbs: 0,
            fat: 13,
            fiber: 0
        }
    },
    {
        name: 'Organic Baby Spinach',
        description: 'Fresh organic baby spinach, perfect for salads',
        price: 3.99,
        category: 'fruits-vegetables',
        brand: 'Green Leaf',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500'],
        toppick: false,
        popular: true,
        unit: 'lb',
        organic: true,
        nutrition: {
            calories: 23,
            protein: 2.9,
            carbs: 3.6,
            fat: 0.4,
            fiber: 2.2
        }
    },

    // Additional FRUITS & VEGETABLES
    {
        name: 'Roma Tomatoes',
        description: 'Fresh Roma tomatoes, perfect for sauces and salads',
        price: 2.49,
        category: 'fruits-vegetables',
        brand: 'Farm Fresh',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 18,
            protein: 0.9,
            carbs: 3.9,
            fat: 0.2,
            fiber: 1.2
        }
    },
    {
        name: 'Sweet Bell Peppers',
        description: 'Colorful mix of red, yellow, and orange bell peppers',
        price: 1.99,
        category: 'fruits-vegetables',
        brand: 'Garden Fresh',
        stock: 85,
        images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500'],
        toppick: false,
        popular: false,
        unit: 'piece',
        organic: true,
        nutrition: {
            calories: 31,
            protein: 1,
            carbs: 6,
            fat: 0.3,
            fiber: 2.1
        }
    },

    // Additional DAIRY & EGGS
    {
        name: 'Greek Yogurt',
        description: 'Creamy organic Greek yogurt, high in protein',
        price: 5.49,
        category: 'dairy-eggs',
        brand: 'Chobani',
        stock: 70,
        images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: true,
        nutrition: {
            calories: 100,
            protein: 17,
            carbs: 6,
            fat: 0.7,
            fiber: 0
        }
    },
    {
        name: 'Sharp Cheddar Cheese',
        description: 'Aged sharp cheddar cheese, rich and tangy',
        price: 7.99,
        category: 'dairy-eggs',
        brand: 'Tillamook',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 403,
            protein: 25,
            carbs: 1.3,
            fat: 33,
            fiber: 0
        }
    },

    // Additional MEAT & SEAFOOD
    {
        name: 'Grass-Fed Ground Beef',
        description: 'Premium grass-fed ground beef, 85% lean',
        price: 9.99,
        category: 'meat-seafood',
        brand: "Butcher's Choice",
        stock: 40,
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 250,
            protein: 26,
            carbs: 0,
            fat: 15,
            fiber: 0
        }
    },
    {
        name: 'Atlantic Shrimp',
        description: 'Fresh Atlantic shrimp, peeled and deveined',
        price: 12.99,
        category: 'meat-seafood',
        brand: 'Ocean Harvest',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 99,
            protein: 24,
            carbs: 0.2,
            fat: 0.3,
            fiber: 0
        }
    },

    // Additional BAKERY
    {
        name: 'Fresh Croissants',
        description: 'Buttery, flaky croissants baked fresh daily',
        price: 4.99,
        category: 'bakery',
        brand: 'La Boulangerie',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500'],
        toppick: false,
        popular: false,
        unit: 'dozen',
        organic: false,
        nutrition: {
            calories: 231,
            protein: 5,
            carbs: 26,
            fat: 12,
            fiber: 1.5
        }
    },
    {
        name: 'Blueberry Muffins',
        description: 'Fresh-baked blueberry muffins with real berries',
        price: 5.99,
        category: 'bakery',
        brand: 'Daily Bread',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500'],
        toppick: false,
        popular: false,
        unit: 'dozen',
        organic: true,
        nutrition: {
            calories: 420,
            protein: 7,
            carbs: 65,
            fat: 16,
            fiber: 2
        }
    },
    {
        name: 'Whole Wheat Bagels',
        description: 'Hearty whole wheat bagels, perfect for breakfast',
        price: 4.49,
        category: 'bakery',
        brand: 'New York Bagel',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=500'],
        toppick: false,
        popular: false,
        unit: 'dozen',
        organic: false,
        nutrition: {
            calories: 245,
            protein: 10,
            carbs: 48,
            fat: 1.5,
            fiber: 4
        }
    },

    // BEVERAGES
    {
        name: 'Fresh Orange Juice',
        description: 'Not from concentrate, 100% pure orange juice',
        price: 6.99,
        category: 'beverages',
        brand: 'Tropicana',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'],
        toppick: false,
        popular: false,
        unit: 'gallon',
        organic: false,
        nutrition: {
            calories: 110,
            protein: 2,
            carbs: 26,
            fat: 0,
            fiber: 0.5
        }
    },
    {
        name: 'Sparkling Water',
        description: 'Naturally flavored sparkling water, zero calories',
        price: 4.99,
        category: 'beverages',
        brand: 'La Croix',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500'],
        toppick: false,
        popular: false,
        unit: 'liter',
        organic: false,
        nutrition: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        }
    },
    {
        name: 'Cold Brew Coffee',
        description: 'Smooth, rich cold brew coffee concentrate',
        price: 8.99,
        category: 'beverages',
        brand: 'Stumptown',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500'],
        toppick: false,
        popular: false,
        unit: 'gallon',
        organic: true,
        nutrition: {
            calories: 5,
            protein: 0.3,
            carbs: 0,
            fat: 0,
            fiber: 0
        }
    },
    {
        name: 'Organic Green Tea',
        description: 'Premium organic green tea bags, antioxidant-rich',
        price: 5.49,
        category: 'beverages',
        brand: 'Tazo',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'],
        toppick: false,
        popular: false,
        unit: 'oz',
        organic: true,
        nutrition: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        }
    },

    // SNACKS
    {
        name: 'Mixed Nuts',
        description: 'Premium mix of almonds, cashews, and walnuts',
        price: 9.99,
        category: 'snacks',
        brand: 'Blue Diamond',
        stock: 70,
        images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: false,
        nutrition: {
            calories: 607,
            protein: 20,
            carbs: 27,
            fat: 52,
            fiber: 7
        }
    },
    {
        name: 'Organic Tortilla Chips',
        description: 'Crunchy organic corn tortilla chips, restaurant-style',
        price: 3.99,
        category: 'snacks',
        brand: 'Late July',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500'],
        toppick: false,
        popular: false,
        unit: 'oz',
        organic: true,
        nutrition: {
            calories: 140,
            protein: 2,
            carbs: 18,
            fat: 7,
            fiber: 2
        }
    },
    {
        name: 'Dark Chocolate Bar',
        description: '70% cacao dark chocolate, rich and smooth',
        price: 4.49,
        category: 'snacks',
        brand: 'Lindt',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500'],
        toppick: false,
        popular: false,
        unit: 'piece',
        organic: false,
        nutrition: {
            calories: 170,
            protein: 2,
            carbs: 13,
            fat: 12,
            fiber: 3
        }
    },
    {
        name: 'Granola Bars',
        description: 'Crunchy granola bars with honey and oats',
        price: 5.99,
        category: 'snacks',
        brand: 'Nature Valley',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1606312619070-d48b4cdd6d2f?w=500'],
        toppick: false,
        popular: false,
        unit: 'oz',
        organic: true,
        nutrition: {
            calories: 190,
            protein: 4,
            carbs: 29,
            fat: 7,
            fiber: 2
        }
    },

    // PANTRY
    {
        name: 'Organic Pasta',
        description: 'Italian durum wheat pasta, organic and non-GMO',
        price: 3.49,
        category: 'pantry',
        brand: 'Barilla',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: true,
        nutrition: {
            calories: 200,
            protein: 7,
            carbs: 42,
            fat: 1,
            fiber: 2
        }
    },
    {
        name: 'Extra Virgin Olive Oil',
        description: 'Cold-pressed extra virgin olive oil from Italy',
        price: 12.99,
        category: 'pantry',
        brand: 'Colavita',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'],
        toppick: false,
        popular: false,
        unit: 'gallon',
        organic: false,
        nutrition: {
            calories: 120,
            protein: 0,
            carbs: 0,
            fat: 14,
            fiber: 0
        }
    },
    {
        name: 'Organic Brown Rice',
        description: 'Long-grain organic brown rice, nutty and nutritious',
        price: 4.99,
        category: 'pantry',
        brand: 'Lundberg',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'],
        toppick: false,
        popular: false,
        unit: 'lb',
        organic: true,
        nutrition: {
            calories: 216,
            protein: 5,
            carbs: 45,
            fat: 1.8,
            fiber: 3.5
        }
    },
    {
        name: 'Organic Marinara Sauce',
        description: 'Classic Italian marinara sauce with fresh tomatoes',
        price: 5.99,
        category: 'pantry',
        brand: "Rao's",
        stock: 70,
        images: ['https://images.unsplash.com/photo-1627650044575-3371c3d46b79?w=500'],
        toppick: false,
        popular: false,
        unit: 'gallon',
        organic: true,
        nutrition: {
            calories: 90,
            protein: 2,
            carbs: 12,
            fat: 4,
            fiber: 2
        }
    }
]

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ Connected to MongoDB')

        // Delete ALL existing products
        const deleteResult = await Product.deleteMany({})
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} old products`)

        // Insert new grocery products
        const result = await Product.insertMany(groceryProducts)
        console.log(`✅ Added ${result.length} grocery products`)

        console.log('\n📦 Products added:')
        result.forEach(product => {
            console.log(`  - ${product.name} ($${product.price}/${product.unit})${product.organic ? ' 🌱' : ''}`)
        })

        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()
