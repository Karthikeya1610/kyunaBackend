# Items API Documentation

This document describes the API endpoints for managing items in the Kyuna Jewellery Backend.

## Base URL

```
http://localhost:5001/api/items
```

## Authentication

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Item (Admin Only)

**POST** `/api/items`

Creates a new item in the system.

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Request Body:**

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

**Response (201):**

```json
{
  "message": "Item created successfully",
  "item": {
    "_id": "item_id_here",
    "name": "Diamond Ring",
    "category": "Rings",
    "price": 1500,
    "discountPrice": 1200,
    "availability": "In Stock",
    "images": [...],
    "description": "Beautiful diamond ring with 18k gold band",
    "specifications": {...},
    "rating": 0,
    "totalReviews": 0,
    "ratingBreakdown": {},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Items

**GET** `/api/items`

Retrieves all items with optional filtering, sorting, and pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `availability` (optional): Filter by availability ("In Stock" or "Out of Stock")
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `sortBy` (optional): Sort field (default: "createdAt")
- `sortOrder` (optional): Sort order "asc" or "desc" (default: "desc")

**Example Request:**

```
GET /api/items?page=1&limit=20&category=Rings&minPrice=100&maxPrice=2000&sortBy=price&sortOrder=asc
```

**Response (200):**

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

### 3. Search Items

**GET** `/api/items/search`

Searches items by name, description, or category.

**Query Parameters:**

- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**

```
GET /api/items/search?q=diamond&page=1&limit=15
```

**Response (200):**

```json
{
  "message": "Search completed successfully",
  "items": [...],
  "query": "diamond",
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 45,
    "itemsPerPage": 15
  }
}
```

### 4. Get Items by Category

**GET** `/api/items/category/:category`

Retrieves items filtered by a specific category.

**Path Parameters:**

- `category`: Category name

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**

```
GET /api/items/category/Rings?page=1&limit=25
```

**Response (200):**

```json
{
  "message": "Items retrieved successfully",
  "items": [...],
  "category": "Rings",
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 35,
    "itemsPerPage": 25
  }
}
```

### 5. Get Item by ID

**GET** `/api/items/:id`

Retrieves a single item by its ID.

**Path Parameters:**

- `id`: Item ID

**Example Request:**

```
GET /api/items/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response (200):**

```json
{
  "message": "Item retrieved successfully",
  "item": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Diamond Ring",
    "category": "Rings",
    "price": 1500,
    "discountPrice": 1200,
    "availability": "In Stock",
    "images": [...],
    "description": "Beautiful diamond ring with 18k gold band",
    "specifications": {...},
    "rating": 4.5,
    "totalReviews": 12,
    "ratingBreakdown": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Update Item (Admin Only)

**PUT** `/api/items/:id`

Updates an existing item.

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Path Parameters:**

- `id`: Item ID

**Request Body:**

```json
{
  "price": 1600.0,
  "discountPrice": 1300.0,
  "availability": "Out of Stock",
  "description": "Updated description for the diamond ring"
}
```

**Response (200):**

```json
{
  "message": "Item updated successfully",
  "item": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Diamond Ring",
    "category": "Rings",
    "price": 1600,
    "discountPrice": 1300,
    "availability": "Out of Stock",
    "images": [...],
    "description": "Updated description for the diamond ring",
    "specifications": {...},
    "rating": 4.5,
    "totalReviews": 12,
    "ratingBreakdown": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### 7. Delete Item (Admin Only)

**DELETE** `/api/items/:id`

Deletes an item from the system.

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Path Parameters:**

- `id`: Item ID

**Example Request:**

```
DELETE /api/items/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response (200):**

```json
{
  "message": "Item deleted successfully",
  "item": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Diamond Ring",
    "category": "Rings",
    "price": 1600,
    "discountPrice": 1300,
    "availability": "Out of Stock",
    "images": [...],
    "description": "Updated description for the diamond ring",
    "specifications": {...},
    "rating": 4.5,
    "totalReviews": 12,
    "ratingBreakdown": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Name, category, and price are required fields"
}
```

### 401 Unauthorized

```json
{
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden

```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found

```json
{
  "message": "Item not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error while creating item",
  "error": "Error details"
}
```

## Data Models

### Item Schema

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

## Usage Examples

### JavaScript/Node.js

```javascript
const axios = require("axios");

// Get all items
const getAllItems = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/items");
    return response.data;
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};

// Create item (admin only)
const createItem = async (itemData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/items",
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```

### cURL Examples

**Get all items:**

```bash
curl -X GET "http://localhost:5001/api/items"
```

**Search items:**

```bash
curl -X GET "http://localhost:5001/api/items/search?q=diamond&page=1&limit=10"
```

**Create item (admin only):**

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

**Update item (admin only):**

```bash
curl -X PUT "http://localhost:5001/api/items/ITEM_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1600.00
  }'
```

**Delete item (admin only):**

```bash
curl -X DELETE "http://localhost:5001/api/items/ITEM_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
