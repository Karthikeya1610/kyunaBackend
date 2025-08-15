# Kyuna Jewellery Backend

A MERN stack backend API for the Kyuna Jewellery e-commerce platform.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory with:

```
PORT=5000
NODE_ENV=development
```

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 4. Test the API

- **Base URL**: `http://localhost:5000`
- **Hello World**: `http://localhost:5000/api/hello`
- **Health Check**: `http://localhost:5000/api/health`

## Current Endpoints

- `GET /` - Welcome message
- `GET /api/hello` - Hello World endpoint
- `GET /api/health` - Health check

## Project Structure

```
kyuna-jewellery-backend/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB configuration
│   └── cloudinary.js      # Cloudinary configuration
├── controllers/            # Business logic controllers
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # User management logic
│   ├── productController.js # Product management logic
│   ├── categoryController.js # Category management logic
│   ├── orderController.js # Order management logic
│   ├── cartController.js  # Cart management logic
│   ├── reviewController.js # Review management logic
│   └── adminController.js # Admin functionality logic
├── middleware/             # Custom middleware
│   ├── auth.js            # Authentication middleware
│   ├── validation.js      # Input validation middleware
│   ├── upload.js          # File upload middleware
│   └── errorHandler.js    # Error handling middleware
├── models/                 # Database models
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Category.js        # Category schema
│   ├── Order.js           # Order schema
│   ├── Cart.js            # Cart schema
│   └── Review.js          # Review schema
├── routes/                 # API route definitions
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management routes
│   ├── products.js        # Product management routes
│   ├── categories.js      # Category management routes
│   ├── orders.js          # Order management routes
│   ├── cart.js            # Cart management routes
│   ├── reviews.js         # Review management routes
│   └── admin.js           # Admin functionality routes
├── utils/                  # Utility functions
│   ├── emailService.js    # Email service utilities
│   ├── paymentService.js  # Payment service utilities
│   ├── logger.js          # Logging utilities
│   └── helpers.js         # Helper functions
├── tests/                  # Test files
│   ├── auth.test.js       # Authentication tests
│   ├── product.test.js    # Product tests
│   └── user.test.js       # User tests
├── docs/                   # Documentation
│   ├── API.md             # API documentation
│   └── SETUP.md           # Setup guide
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
└── README.md               # Project documentation
```

## Next Steps

We'll be building this step by step:

1. ✅ Basic Express server setup
2. ✅ Complete folder structure
3. 🔄 Database models and schemas
4. 🔄 Authentication system
5. 🔄 Product management
6. 🔄 Order management
7. 🔄 User management
8. 🔄 File uploads
9. 🔄 Payment integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (coming soon)
- **Authentication**: JWT (coming soon)
- **File Upload**: Multer + Cloudinary (coming soon)
