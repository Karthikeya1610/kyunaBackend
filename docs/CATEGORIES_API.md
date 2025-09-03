# Categories API Documentation

## Overview

The Categories API provides endpoints for managing product categories. Public endpoints allow users to view categories without authentication, while admin-only endpoints require authentication and admin privileges for creating, updating, and deleting categories.

## Base URL

```
http://localhost:5001/api/categories
```

## Authentication

- **Public Endpoints**: No authentication required
- **Admin Endpoints**: Requires Bearer token with admin role
  ```
  Authorization: Bearer <your-jwt-token>
  ```

---

## Public Endpoints (No Authentication Required)

### 1. Get All Categories

Retrieve a paginated list of all categories.

**Endpoint:** `GET /api/categories`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `search` (optional): Search categories by name
- `sortBy` (optional): Sort field (default: 'name', options: 'name', 'createdAt', 'updatedAt')
- `sortOrder` (optional): Sort order (default: 'asc', options: 'asc', 'desc')

**Example Request:**

```bash
GET /api/categories?page=1&limit=5&search=necklaces&sortBy=name&sortOrder=asc
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Necklaces",
      "image": "https://example.com/necklaces.jpg",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Rings",
      "image": "https://example.com/rings.jpg",
      "createdAt": "2023-09-06T11:00:00.000Z",
      "updatedAt": "2023-09-06T11:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 5
  }
}
```

### 2. Get Category by ID

Retrieve a specific category by its ID.

**Endpoint:** `GET /api/categories/:id`

**Parameters:**

- `id`: Category ID (MongoDB ObjectId)

**Example Request:**

```bash
GET /api/categories/64f8a1b2c3d4e5f6a7b8c9d0
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Necklaces",
    "image": "https://example.com/necklaces.jpg",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## Admin Endpoints (Authentication Required)

### 3. Create Category

Create a new category (Admin only).

**Endpoint:** `POST /api/categories`

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "New Category",
  "image": "https://example.com/category-image.jpg"
}
```

**Required Fields:**

- `name`: Category name (2-50 characters, unique)

**Optional Fields:**

- `image`: Category image URL

**Example Request:**

```bash
curl -X POST /api/categories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Earrings",
    "image": "https://example.com/earrings.jpg"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "Earrings",
    "image": "https://example.com/earrings.jpg",
    "createdAt": "2023-09-06T12:00:00.000Z",
    "updatedAt": "2023-09-06T12:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Category name is required",
    "Category name must be at least 2 characters long"
  ]
}
```

**Error Response (400 - Duplicate Name):**

```json
{
  "success": false,
  "message": "Category with this name already exists"
}
```

### 4. Update Category

Update an existing category (Admin only).

**Endpoint:** `PUT /api/categories/:id`

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Parameters:**

- `id`: Category ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "name": "Updated Category Name",
  "image": "https://example.com/updated-image.jpg"
}
```

**All fields are optional for updates.**

**Example Request:**

```bash
curl -X PUT /api/categories/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Necklaces",
    "image": "https://example.com/updated-necklaces.jpg"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Updated Necklaces",
    "image": "https://example.com/updated-necklaces.jpg",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T12:30:00.000Z"
  }
}
```

### 5. Delete Category

Delete a category (Admin only).

**Endpoint:** `DELETE /api/categories/:id`

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**

- `id`: Category ID (MongoDB ObjectId)

**Example Request:**

```bash
curl -X DELETE /api/categories/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**

```json
{
  "success": false,
  "message": "Invalid category ID format"
}
```

**401 Unauthorized**

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**403 Forbidden**

```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Category not found"
}
```

**500 Internal Server Error**

```json
{
  "success": false,
  "message": "Error fetching categories",
  "error": "Error details"
}
```

---

## Data Models

### Category Schema

```javascript
{
  _id: ObjectId,
  name: String (required, unique, 2-50 chars),
  image: String (optional, image URL),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage Examples

### JavaScript/Node.js

```javascript
// Get all categories
const response = await fetch('/api/categories?page=1&limit=10');
const categories = await response.json();

// Create category (admin only)
const createResponse = await fetch('/api/categories', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'New Category',
    image: 'https://example.com/image.jpg',
  }),
});

// Update category (admin only)
const updateResponse = await fetch('/api/categories/64f8a1b2c3d4e5f6a7b8c9d0', {
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Category',
    image: 'https://example.com/updated-image.jpg',
  }),
});
```

### cURL Examples

```bash
# Get all categories
curl -X GET "http://localhost:5001/api/categories"

# Get categories with pagination and search
curl -X GET "http://localhost:5001/api/categories?page=1&limit=5&search=necklaces"

# Create category (admin only)
curl -X POST "http://localhost:5001/api/categories" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Category", "image": "https://example.com/image.jpg"}'

# Update category (admin only)
curl -X PUT "http://localhost:5001/api/categories/CATEGORY_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Category", "image": "https://example.com/updated-image.jpg"}'

# Delete category (admin only)
curl -X DELETE "http://localhost:5001/api/categories/CATEGORY_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

1. **Authentication**: Admin endpoints require a valid JWT token with admin role
2. **Hard Delete**: Categories are permanently deleted when using the delete endpoint
3. **Image Field**: The image field is optional and can contain a URL to the category image
4. **Case Insensitive**: Category name searches are case insensitive
5. **Pagination**: All list endpoints support pagination with customizable limits
6. **Validation**: Input validation is performed on all endpoints
7. **Error Handling**: Comprehensive error handling with meaningful messages
