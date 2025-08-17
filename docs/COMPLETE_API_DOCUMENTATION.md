# 🚀 Kyuna Jewellery Backend - Complete API Documentation

This document contains all the API endpoints available in the Kyuna Jewellery Backend system.

## 📋 **Table of Contents**

- [Base Information](#base-information)
- [Authentication](#authentication)
- [Items API](#items-api)
- [Orders API](#orders-api)
- [Auth API](#auth-api)
- [Uploads API](#uploads-api)
- [Error Responses](#error-responses)
- [Data Models](#data-models)
- [Testing Examples](#testing-examples)

---

## 🌐 **Base Information**

**Base URL:** `http://localhost:5001/api`
**Health Check:** `http://localhost:5001/api/health`

---

## 🔐 **Authentication**

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📦 **Items API**

**Base Endpoint:** `/api/items`

### **Create Item (Admin Only)**

- **Method:** `POST`
- **URL:** `/api/items`
- **Auth:** Required (Admin)
- **Body:**

```json
{
  "name": "Diamond Ring",
  "category": "Rings",
  "price": 1500.0,
  "discountPrice": 1200.0,
  "availability": "In Stock",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "publicId": "image1_public_id"
    }
  ],
  "description": "Beautiful diamond ring with 18k gold band",
  "specifications": {
    "carat": "1.5",
    "clarity": "VS1",
    "color": "D",
    "metal": "18k Gold"
  }
}
```

### **Get All Items (Public)**

- **Method:** `GET`
- **URL:** `/api/items`
- **Auth:** Not Required
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `category` (optional): Filter by category
  - `availability` (optional): "In Stock" or "Out of Stock"
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
  - `sortBy` (optional): Sort field (default: "createdAt")
  - `sortOrder` (optional): "asc" or "desc" (default: "desc")

**Example URLs:**

```
GET /api/items?page=1&limit=20
GET /api/items?category=Rings&minPrice=100&maxPrice=2000
GET /api/items?sortBy=price&sortOrder=asc&page=2&limit=15
```

### **Search Items (Public)**

- **Method:** `GET`
- **URL:** `/api/items/search`
- **Auth:** Not Required
- **Query Parameters:**
  - `q` (required): Search query
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Example URLs:**

```
GET /api/items/search?q=diamond&page=1&limit=15
GET /api/items/search?q=ring&page=2&limit=10
```

### **Get Items by Category (Public)**

- **Method:** `GET`
- **URL:** `/api/items/category/:category`
- **Auth:** Not Required
- **Path Parameters:**
  - `category`: Category name
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Example URLs:**

```
GET /api/items/category/Rings?page=1&limit=25
GET /api/items/category/Necklaces?page=2&limit=15
```

### **Get Item by ID (Public)**

- **Method:** `GET`
- **URL:** `/api/items/:id`
- **Auth:** Not Required
- **Path Parameters:**
  - `id`: Item ID

**Example URL:**

```
GET /api/items/64f8a1b2c3d4e5f6a7b8c9d0
```

### **Update Item (Admin Only)**

- **Method:** `PUT`
- **URL:** `/api/items/:id`
- **Auth:** Required (Admin)
- **Path Parameters:**
  - `id`: Item ID
- **Body:**

```json
{
  "price": 1600.0,
  "discountPrice": 1300.0,
  "availability": "Out of Stock",
  "description": "Updated description"
}
```

### **Delete Item (Admin Only)**

- **Method:** `DELETE`
- **URL:** `/api/items/:id`
- **Auth:** Required (Admin)
- **Path Parameters:**
  - `id`: Item ID

---

## 📋 **Orders API**

**Base Endpoint:** `/api/orders`

### **Create Order (User)**

- **Method:** `POST`
- **URL:** `/api/orders`
- **Auth:** Required (User)
- **Body:**

```json
{
  "orderItems": [
    {
      "item": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Diamond Engagement Ring",
      "price": 2200.0,
      "quantity": 1,
      "image": "https://example.com/image.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1-555-0123"
  },
  "paymentMethod": "Credit Card",
  "itemsPrice": 2200.0,
  "taxPrice": 176.0,
  "shippingPrice": 25.0,
  "notes": "Please deliver during business hours"
}
```

### **Get User Orders (User)**

- **Method:** `GET`
- **URL:** `/api/orders/my-orders`
- **Auth:** Required (User)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Orders per page (default: 10)
  - `status` (optional): Filter by order status

**Example URLs:**

```
GET /api/orders/my-orders?page=1&limit=5
GET /api/orders/my-orders?status=Pending
```

### **Get Order by ID (User/Admin)**

- **Method:** `GET`
- **URL:** `/api/orders/:id`
- **Auth:** Required (User can view their own, Admin can view any)

### **Cancel Order (User)**

- **Method:** `PUT`
- **URL:** `/api/orders/:id/cancel`
- **Auth:** Required (User - their own order)
- **Body:**

```json
{
  "cancellationReason": "Changed my mind"
}
```

### **Get All Orders (Admin Only)**

- **Method:** `GET`
- **URL:** `/api/orders`
- **Auth:** Required (Admin)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Orders per page (default: 10)
  - `status` (optional): Filter by order status
  - `userId` (optional): Filter by user ID
  - `city` (optional): Filter by shipping city
  - `minPrice` (optional): Minimum total price
  - `maxPrice` (optional): Maximum total price
  - `startDate` (optional): Filter from date
  - `endDate` (optional): Filter to date
  - `sortBy` (optional): Sort field (default: "createdAt")
  - `sortOrder` (optional): Sort order "asc" or "desc" (default: "desc")

**Example URLs:**

```
GET /api/orders?page=1&limit=20
GET /api/orders?status=Pending&city=New York
GET /api/orders?minPrice=1000&maxPrice=5000&sortBy=totalPrice
```

### **Update Order Status (Admin Only)**

- **Method:** `PUT`
- **URL:** `/api/orders/:id/status`
- **Auth:** Required (Admin)
- **Body:**

```json
{
  "status": "Shipped",
  "notes": "Order shipped via express delivery"
}
```

### **Admin Cancel Order (Admin Only)**

- **Method:** `PUT`
- **URL:** `/api/orders/:id/admin-cancel`
- **Auth:** Required (Admin)
- **Body:**

```json
{
  "cancellationReason": "Out of stock"
}
```

### **Get Order Statistics (Admin Only)**

- **Method:** `GET`
- **URL:** `/api/orders/stats/overview`
- **Auth:** Required (Admin)
- **Query Parameters:**
  - `period` (optional): Period in days (default: 30)

**Example URL:**

```
GET /api/orders/stats/overview?period=7
```

---

## 🔑 **Auth API**

**Base Endpoint:** `/api/auth`

### **User Registration**

- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Auth:** Not Required
- **Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### **Admin Registration**

- **Method:** `POST`
- **URL:** `/api/auth/register-admin`
- **Auth:** Not Required
- **Body:**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "adminCode": "ADMIN_SECRET_CODE"
}
```

### **User Login**

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Auth:** Not Required
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 📤 **Uploads API**

**Base Endpoint:** `/api/image`

### **Upload Image**

- **Method:** `POST`
- **URL:** `/api/image/upload`
- **Auth:** Required
- **Body:** Form data with image file

### **Delete Image**

- **Method:** `DELETE`
- **URL:** `/api/image/:publicId`
- **Auth:** Required
- **Path Parameters:**
  - `publicId`: Cloudinary public ID

---

## 📊 **Pagination Response Format**

All paginated endpoints return this structure:

```json
{
  "message": "Items retrieved successfully",
  "items": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

---

## 🚨 **Error Responses**

### **400 Bad Request**

```json
{
  "message": "Name, category, and price are required fields"
}
```

### **401 Unauthorized**

```json
{
  "message": "Access denied. No token provided."
}
```

### **403 Forbidden**

```json
{
  "message": "Access denied. Admin role required."
}
```

### **404 Not Found**

```json
{
  "message": "Item not found"
}
```

### **500 Internal Server Error**

```json
{
  "message": "Server error while creating item",
  "error": "Error details"
}
```

---

## 📋 **Data Models**

### **Item Schema**

```javascript
{
  name: String (required),
  category: String (required),
  price: Number (required, > 0),
  discountPrice: Number (optional, < price),
  rating: Number (default: 0),
  totalReviews: Number (default: 0),
  availability: String (enum: ["In Stock", "Out of Stock"], default: "In Stock"),
  images: Array of {
    url: String (required),
    publicId: String (required)
  },
  description: String (default: ""),
  specifications: Map of String,
  ratingBreakdown: Map of Number (default: {}),
  createdAt: Date,
  updatedAt: Date
}
```

### **User Schema**

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

### **Order Schema**

```javascript
{
  user: ObjectId (ref: User, required),
  orderItems: [{
    item: ObjectId (ref: Item, required),
    name: String (required),
    price: Number (required),
    quantity: Number (required, min: 1),
    image: String (required)
  }],
  shippingAddress: {
    address: String (required),
    city: String (required),
    postalCode: String (required),
    country: String (required),
    phone: String (required)
  },
  paymentMethod: String (enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"], required),
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: Number (required, default: 0.0),
  taxPrice: Number (required, default: 0.0),
  shippingPrice: Number (required, default: 0.0),
  totalPrice: Number (required, default: 0.0),
  status: String (enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"], default: "Pending"),
  isPaid: Boolean (default: false),
  paidAt: Date,
  isDelivered: Boolean (default: false),
  deliveredAt: Date,
  notes: String (default: ""),
  cancellationReason: String (default: ""),
  cancelledBy: String (enum: ["user", "admin"], default: ""),
  cancelledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 **Testing Examples**

### **cURL Commands**

#### **Get All Items**

```bash
curl -X GET "http://localhost:5001/api/items"
```

#### **Get Items with Pagination**

```bash
curl -X GET "http://localhost:5001/api/items?page=1&limit=20"
```

#### **Search Items**

```bash
curl -X GET "http://localhost:5001/api/items/search?q=diamond&page=1&limit=10"
```

#### **Get Items by Category**

```bash
curl -X GET "http://localhost:5001/api/items/category/Rings?page=1&limit=25"
```

#### **Create Item (Admin Only)**

```bash
curl -X POST "http://localhost:5001/api/items" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Diamond Ring",
    "category": "Rings",
    "price": 1500.00,
    "description": "Beautiful diamond ring"
  }'
```

#### **Update Item (Admin Only)**

```bash
curl -X PUT "http://localhost:5001/api/items/ITEM_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1600.00
  }'
```

#### **Delete Item (Admin Only)**

```bash
curl -X DELETE "http://localhost:5001/api/items/ITEM_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **User Registration**

```bash
curl -X POST "http://localhost:5001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### **User Login**

```bash
curl -X POST "http://localhost:5001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### **Create Order (User)**

```bash
curl -X POST "http://localhost:5001/api/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [
      {
        "item": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Diamond Engagement Ring",
        "price": 2200.00,
        "quantity": 1,
        "image": "https://example.com/image.jpg"
      }
    ],
    "shippingAddress": {
      "address": "123 Main Street",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA",
      "phone": "+1-555-0123"
    },
    "paymentMethod": "Credit Card",
    "itemsPrice": 2200.00,
    "taxPrice": 176.00,
    "shippingPrice": 25.00,
    "notes": "Please deliver during business hours"
  }'
```

#### **Get User Orders**

```bash
curl -X GET "http://localhost:5001/api/orders/my-orders?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Cancel Order (User)**

```bash
curl -X PUT "http://localhost:5001/api/orders/ORDER_ID/cancel" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Changed my mind"
  }'
```

#### **Get All Orders (Admin)**

```bash
curl -X GET "http://localhost:5001/api/orders?page=1&limit=20&status=Pending" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### **Update Order Status (Admin)**

```bash
curl -X PUT "http://localhost:5001/api/orders/ORDER_ID/status" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shipped",
    "notes": "Order placed via express delivery"
  }'
```

#### **Get Order Statistics (Admin)**

```bash
curl -X PUT "http://localhost:5001/api/orders/stats/overview?period=7" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### **JavaScript/Node.js Examples**

```javascript
const axios = require('axios');

// Get all items
const getAllItems = async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/items');
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Get items with pagination
const getItemsWithPagination = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/items?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Search items
const searchItems = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/items/search?q=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Create item (admin only)
const createItem = async (itemData, token) => {
  try {
    const response = await axios.post(
      'http://localhost:5001/api/items',
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// User login
const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};
```

---

## 📝 **Quick Reference**

### **Public Endpoints (No Auth Required)**

- `GET /api/items` - Get all items
- `GET /api/items/search` - Search items
- `GET /api/items/category/:category` - Get items by category
- `GET /api/items/:id` - Get item by ID
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Protected Endpoints (Auth Required)**

- `POST /api/items` - Create item (Admin only)
- `PUT /api/items/:id` - Update item (Admin only)
- `DELETE /api/items/:id` - Delete item (Admin only)
- `POST /api/image/upload` - Upload image
- `DELETE /api/image/:publicId` - Delete image
- `POST /api/orders` - Create order (User)
- `GET /api/orders/my-orders` - Get user orders (User)
- `GET /api/orders/:id` - Get order by ID (User/Admin)
- `PUT /api/orders/:id/cancel` - Cancel order (User)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/admin-cancel` - Admin cancel order (Admin only)
- `GET /api/orders/stats/overview` - Get order statistics (Admin only)

### **Pagination Parameters**

- `page` - Page number (starts from 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: "createdAt")
- `sortOrder` - Sort order "asc" or "desc"

### **Filter Parameters**

- `category` - Filter by category
- `availability` - Filter by stock status
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

---

## 🔧 **Environment Variables**

Make sure these environment variables are set in your `.env` file:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_REGISTRATION_CODE=your_admin_code
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 📱 **API Status Codes**

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

---

## 🚀 **Getting Started**

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Test the health endpoint:**

   ```bash
   curl http://localhost:5001/api/health
   ```

3. **Register a user:**

   ```bash
   curl -X POST "http://localhost:5001/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
   ```

4. **Login to get token:**

   ```bash
   curl -X POST "http://localhost:5001/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```

5. **Use the token for protected endpoints:**
   ```bash
   curl -X GET "http://localhost:5001/api/items" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

---

_Last Updated: January 2024_
_Version: 1.0.0_
