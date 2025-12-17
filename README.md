# 🛒 GroceryHub - Vietnamese Grocery E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

**A modern, full-stack e-commerce platform specializing in Vietnamese groceries with AI-powered recipe suggestions**

[Live Demo](https://groceryhub.vercel.app) · [Report Bug](https://github.com/marcusha429/my-ecommerce-project/issues) · [Request Feature](https://github.com/marcusha429/my-ecommerce-project/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ Core E-Commerce
- **Product Catalog**: Browse 86+ Vietnamese grocery products across multiple categories
- **Smart Search & Filtering**: Find products by name, category, or dietary preferences
- **Shopping Cart**: Add, update, and manage items with real-time price calculations
- **Secure Checkout**: Encrypted payment processing and order management
- **User Authentication**: JWT-based secure login and registration system
- **Order Tracking**: Monitor order status from placement to delivery

### 🤖 AI-Powered Features
- **Smart Recipe Suggestions**: Gemini AI analyzes your cart and suggests recipes you can make
- **International Cuisine**: Recipes from Vietnamese, Western, Mediterranean, and more
- **Missing Ingredients**: AI identifies what you need and suggests available products
- **Custom Recipe Check**: Upload your own recipe and check ingredient availability
- **Nutrition Information**: USDA database integration for accurate nutritional data

### 👨‍💼 Admin Dashboard
- **Product Management**: CRUD operations for products with image uploads
- **Category Management**: Organize products into structured categories
- **Inventory Tracking**: Monitor stock levels and set low-stock alerts
- **Order Management**: Process and fulfill customer orders
- **Analytics Dashboard**: Track sales, popular products, and customer trends

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic cart updates and instant search results
- **Image Optimization**: Cloudinary CDN for fast image delivery
- **Progressive Web App**: Install on mobile devices for app-like experience
- **Multilingual Support**: Ready for Vietnamese and English content

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.5](https://nextjs.org/) with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Axios
- **Authentication**: JWT with HTTP-only cookies
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js with Express 5
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose 8.18
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **AI Integration**: Google Gemini AI 2.5 Flash
- **Security**: Helmet, CORS, Express Validator
- **API Design**: RESTful architecture

### DevOps & Deployment
- **Hosting**: Vercel (Serverless Functions)
- **CI/CD**: GitHub + Vercel Auto-Deploy
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary for images
- **Version Control**: Git + GitHub
- **Environment Management**: dotenv

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Next.js    │  │  Tailwind    │  │  TypeScript  │  │
│  │   Frontend   │  │     CSS      │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS/REST API
┌───────────────────────▼─────────────────────────────────┐
│                  API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express.js (Serverless Functions on Vercel)    │  │
│  │  • JWT Authentication                            │  │
│  │  • Rate Limiting                                 │  │
│  │  • CORS Security                                 │  │
│  │  • Input Validation                              │  │
│  └──────────────────────────────────────────────────┘  │
└───────────┬─────────────────┬───────────────┬──────────┘
            │                 │               │
    ┌───────▼────────┐ ┌─────▼─────┐ ┌──────▼──────┐
    │   MongoDB      │ │ Cloudinary │ │  Gemini AI  │
    │    Atlas       │ │    CDN     │ │   Service   │
    │  (Database)    │ │  (Images)  │ │  (Recipes)  │
    └────────────────┘ └────────────┘ └─────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Google AI (Gemini) API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/marcusha429/my-ecommerce-project.git
   cd my-ecommerce-project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables** (see [Environment Variables](#-environment-variables))

5. **Run development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/groceryhub

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NEXT_PUBLIC_ENV=development
```

---

## 🌐 Deployment

### Vercel Deployment (Recommended)

#### Backend Deployment

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `backend`
4. Add environment variables in Vercel dashboard
5. Deploy!

**Production URL**: https://backend-two-black-z2s751fjw8.vercel.app

#### Frontend Deployment

1. Import project on Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend Vercel URL
4. Deploy!

**Production URL**: https://groceryhub.vercel.app

### CI/CD Pipeline

Auto-deployment is configured via GitHub integration:
- Push to `main` branch → Automatic deployment
- Preview deployments for pull requests
- Rollback capability for failed deployments

---

## 📚 API Documentation

### Authentication

```http
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/verify
```

### Products

```http
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (Admin)
PUT    /api/products/:id          # Update product (Admin)
DELETE /api/products/:id          # Delete product (Admin)
GET    /api/products/category/:cat # Get by category
GET    /api/products/popular      # Get popular products
GET    /api/products/toppick      # Get top picks
```

### Cart

```http
GET    /api/cart                  # Get user's cart
POST   /api/cart/add              # Add item to cart
PUT    /api/cart/update           # Update cart item
DELETE /api/cart/remove/:productId # Remove from cart
DELETE /api/cart/clear            # Clear entire cart
```

### AI Features

```http
POST   /api/ai/chat               # Chat with AI assistant
POST   /api/ai/analyze-cart       # Get recipe suggestions
POST   /api/ai/check-recipe       # Check custom recipe
```

### Orders

```http
GET    /api/orders                # Get user's orders
POST   /api/orders                # Create new order
GET    /api/orders/:id            # Get order details
```

---

## 📁 Project Structure

```
my-ecommerce-project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.js               # Authentication logic
│   │   ├── products.js           # Product CRUD
│   │   ├── cart.js               # Cart management
│   │   ├── orders.js             # Order processing
│   │   └── ai.js                 # AI features
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── adminAuth.js          # Admin authorization
│   │   ├── rateLimiting.js       # Rate limiting
│   │   └── upload.js             # File upload (Multer)
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── products.js           # Product routes
│   │   ├── cart.js               # Cart routes
│   │   ├── orders.js             # Order routes
│   │   └── ai.js                 # AI routes
│   ├── utils/
│   │   ├── geminiAI.js           # Gemini AI integration
│   │   └── cloudinary.js         # Image upload utilities
│   ├── scripts/
│   │   └── clearCartCache.js     # Maintenance scripts
│   ├── server.js                 # Express app entry point
│   ├── vercel.json               # Vercel configuration
│   └── package.json
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── auth/
│   │   │   │   ├── signin/       # Sign in page
│   │   │   │   └── signup/       # Sign up page
│   │   │   ├── products/         # Product pages
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── checkout/         # Checkout flow
│   │   │   └── admin/            # Admin dashboard
│   │   │       ├── products/
│   │   │       │   ├── add/      # Add product
│   │   │       │   └── edit/[id] # Edit product
│   │   │       └── orders/       # Order management
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── ProductList.tsx
│   │   │   ├── cart/
│   │   │   │   └── CartItem.tsx
│   │   │   ├── ai/
│   │   │   │   ├── SmartCartRecipes.tsx
│   │   │   │   └── RecipeCheckModal.tsx
│   │   │   └── admin/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── AdminHeader.tsx
│   │   │       └── ImageUpload.tsx
│   │   ├── lib/
│   │   │   ├── api.ts            # API client
│   │   │   ├── auth.ts           # Auth utilities
│   │   │   └── usda.ts           # USDA nutrition API
│   │   └── types/
│   │       ├── product.ts
│   │       ├── cart.ts
│   │       └── user.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── .prettierrc
└── README.md
```

---

## 🔒 Security

### Implemented Security Measures

- **Authentication**: JWT tokens with HTTP-only cookies
- **Password Security**: bcryptjs hashing with salt rounds
- **Input Validation**: Express Validator for all user inputs
- **Rate Limiting**: Protection against brute-force attacks
- **CORS**: Configured to allow only trusted origins
- **Helmet**: Security headers for Express
- **XSS Protection**: Input sanitization and output encoding
- **SQL Injection**: MongoDB parameterized queries via Mongoose
- **File Upload**: Type validation and size limits
- **Environment Variables**: Sensitive data in .env files (not committed)

### Security Best Practices

1. **Never commit .env files** to version control
2. **Rotate JWT secrets** regularly in production
3. **Use HTTPS** in production (enforced by Vercel)
4. **Monitor rate limits** and adjust as needed
5. **Regular dependency updates** via `npm audit`
6. **Implement CSP headers** for additional protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write clean, documented code
- Follow existing code style (Prettier configuration)
- Add tests for new features
- Update README if needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**Marcus Ha**
- GitHub: [@marcusha429](https://github.com/marcusha429)
- Email: marcusha429@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Hosting and deployment
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image CDN
- [Google Gemini AI](https://ai.google.dev/) - AI recipe suggestions
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

## 📞 Support

For support, email marcusha429@gmail.com or open an issue on GitHub.

---

<div align="center">

Made with ❤️ by Marcus Ha

**[⬆ back to top](#-groceryhub---vietnamese-grocery-e-commerce-platform)**

</div>
