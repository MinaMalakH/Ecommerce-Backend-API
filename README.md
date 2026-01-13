# E-Commerce Backend API

Modern, secure, and scalable RESTful API built for e-commerce applications using **Node.js**, **Express**, **MongoDB**, and modern best practices.


## ✨ Features

- **Secure Authentication**

  - JWT Access + Refresh Token rotation
  - Email verification with secure hashed tokens
  - Password change with session invalidation
  - Role-based authorization (User / Admin)

- **Product Management**

  - CRUD operations (Admin only)
  - Cloudinary image upload with size/format validation
  - Advanced search, filtering, pagination & text search
  - Discount price support

- **Category Management** (nested categories support)
- **Order System**

  - Create orders with real-time stock deduction
  - Multiple payment methods (COD + Card placeholder)
  - Order status management (Admin)
  - User order history

- **Reviews & Ratings**

  - Prevent duplicate reviews
  - Automatic average rating & review count calculation

- **Admin Dashboard Analytics**

  - Overview stats (users, products, orders, revenue)
  - Orders by status
  - Monthly revenue breakdown
  - Top selling products

- **Developer Experience**
  - Joi validation middleware
  - Global error handling & 404
  - Environment-based email (Ethereal for dev, Gmail for prod)
  - Clean MVC-like architecture (Controllers / Services / Models)
  - Comprehensive logging & health check endpoint

## 🛠 Tech Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + Refresh Tokens
- **Image Storage**: Cloudinary + Multer
- **Email**: Nodemailer (Ethereal dev / Gmail prod)
- **Validation**: Joi
- **Security**: bcrypt, helmet (recommended), rate limiting (recommended)
- **Other**: slugify, crypto, aggregation pipelines

## 📁 Project Structure

```
.
├── app.js                          # Application entry point
├── package.json                    # Project dependencies
├── README.md                       # Project documentation
├── LICENSE                         # MIT License
├── .env.example                    # Environment variables template
├── Ecommerce-Backend-API.postman_collection.json  # Postman collection
└── src/
    ├── config/                     # Configuration files
    │   ├── cloudinary.js           # Cloudinary setup
    │   ├── DB.js                   # MongoDB connection
    │   └── nodemailer.js           # Email configuration
    ├── controllers/                # Route handlers & business logic
    │   ├── admin.controller.js     # Admin analytics endpoints
    │   ├── auth.controller.js      # Authentication logic
    │   ├── category.controller.js  # Category operations
    │   ├── order.controller.js     # Order management
    │   ├── product.controller.js   # Product operations
    │   └── review.controller.js    # Review operations
    ├── middlewares/                # Express middlewares
    │   ├── auth.middleware.js      # JWT authentication
    │   ├── role.middleware.js      # Role-based access control
    │   ├── upload.middleware.js    # Image upload handling
    │   └── validation.js           # Request validation
    ├── models/                     # Database schemas (Mongoose)
    │   ├── Category.js
    │   ├── Order.js
    │   ├── Product.js
    │   ├── RefreshToken.js
    │   ├── Review.js
    │   └── User.js
    ├── routes/                     # API route definitions
    │   ├── admin.routes.js
    │   ├── auth.routes.js
    │   ├── category.routes.js
    │   ├── order.routes.js
    │   ├── product.routes.js
    │   └── review.routes.js
    ├── services/                   # Business logic & database operations
    │   ├── admin.service.js
    │   ├── auth.service.js
    │   ├── category.service.js
    │   ├── email.service.js
    │   ├── order.service.js
    │   ├── product.service.js
    │   └── review.service.js
    ├── utils/                      # Utility functions
    │   ├── emailsTemplates.js      # Email HTML templates
    │   └── tokens.js               # Token generation utilities
    └── validator/                  # Request validation schemas
        └── auth.validator.js       # Joi validation schemas
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail (for production emails — use App Password)

### Installation

```bash
# Clone the repository
git clone https://github.com/MinaMalakH/Ecommerce-Backend-API.git
cd Ecommerce-Backend-API

# Install dependencies
npm install

# Create .env file (use .env.example as template)
cp .env.example .env

# Fill in your environment variables
# Important ones:
# MONGODB_URI
# JWT_ACCESS_SECRET
# JWT_REFRESH_SECRET
# CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
# EMAIL_USER / EMAIL_PASS (for production)
# FRONTEND_URL

# Start development server
npm run dev
```

## 📚 API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check

| Method | Endpoint  | Description         | Auth |
| ------ | --------- | ------------------- | ---- |
| GET    | `/health` | Server health check | ❌   |

### Authentication

| Method | Endpoint                    | Description               | Auth |
| ------ | --------------------------- | ------------------------- | ---- |
| POST   | `/auth/register`            | Register new user         | ❌   |
| POST   | `/auth/login`               | Login user                | ❌   |
| POST   | `/auth/refresh`             | Refresh access token      | ❌   |
| POST   | `/auth/logout`              | Logout user               | ✅   |
| GET    | `/auth/verify-email`        | Verify email with token   | ❌   |
| GET    | `/auth/resend-verification` | Resend verification email | ❌   |
| GET    | `/auth/me`                  | Get current user profile  | ✅   |
| PATCH  | `/auth/change-password`     | Change user password      | ✅   |

### Categories

| Method | Endpoint        | Description        | Auth | Role  |
| ------ | --------------- | ------------------ | ---- | ----- |
| POST   | `/category`     | Create category    | ✅   | Admin |
| GET    | `/category`     | Get all categories | ❌   | -     |
| GET    | `/category/:id` | Get category by ID | ❌   | -     |
| PATCH  | `/category/:id` | Update category    | ✅   | Admin |
| DELETE | `/category/:id` | Delete category    | ✅   | Admin |

### Products

| Method | Endpoint       | Description                              | Auth | Role  |
| ------ | -------------- | ---------------------------------------- | ---- | ----- |
| POST   | `/product`     | Create product (with image)              | ✅   | Admin |
| GET    | `/product`     | Get all products (paginated, searchable) | ❌   | -     |
| GET    | `/product/:id` | Get product by ID                        | ❌   | -     |
| PATCH  | `/product/:id` | Update product                           | ✅   | Admin |
| DELETE | `/product/:id` | Delete product                           | ✅   | Admin |

**Query Parameters for GET /product:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or description

### Orders

| Method | Endpoint     | Description         | Auth | Role  |
| ------ | ------------ | ------------------- | ---- | ----- |
| POST   | `/order`     | Create order        | ✅   | User  |
| GET    | `/order/me`  | Get user's orders   | ✅   | User  |
| GET    | `/order`     | Get all orders      | ✅   | Admin |
| PATCH  | `/order/:id` | Update order status | ✅   | Admin |

### Reviews

| Method | Endpoint             | Description                  | Auth | Role |
| ------ | -------------------- | ---------------------------- | ---- | ---- |
| POST   | `/review/:productId` | Create/update product review | ✅   | User |

### Admin Analytics

| Method | Endpoint                           | Description                                           | Auth | Role  |
| ------ | ---------------------------------- | ----------------------------------------------------- | ---- | ----- |
| GET    | `/admin/analytics/overview`        | Get overview stats (users, products, orders, revenue) | ✅   | Admin |
| GET    | `/admin/analytics/order-by-status` | Get orders grouped by status                          | ✅   | Admin |
| GET    | `/admin/analytics/monthly-revenue` | Get monthly revenue breakdown                         | ✅   | Admin |
| GET    | `/admin/analytics/top-products`    | Get top selling products                              | ✅   | Admin |

**Legend:**

- ✅ = Requires authentication
- ❌ = Public endpoint

## 📤 Postman Collection

A complete Postman collection is included: `Ecommerce-Backend-API.postman_collection.json`

### How to Import:

1. Open Postman
2. Click **Import** → **Upload Files** (or drag & drop)
3. Select `Ecommerce-Backend-API.postman_collection.json`
4. Set environment variables:
   - `base_url` = `http://localhost:5000` (or your API URL)
   - `access_token` = Your JWT token (obtained after login)

## 📝 Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email (Development - Ethereal)
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mina Malak**

- GitHub: [@MinaMalakH](https://github.com/MinaMalakH)
- Project: [Ecommerce-Backend-API](https://github.com/MinaMalakH/Ecommerce-Backend-API)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!
