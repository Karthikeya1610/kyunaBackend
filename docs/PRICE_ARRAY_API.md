# Price Array API Documentation

This document describes the Price Array API endpoints for managing multiple prices in an array format.

## Base URL

```
http://localhost:5001/api/prices
```

## Authentication

- **Read operations**: No authentication required (public access)
- **Write operations**: Requires authentication token and admin privileges

## Data Model

### Price Array Schema

```json
{
  "prices": [
    {
      "_id": "ObjectId", // Unique identifier for each price
      "originalPrice": "Number", // Original price (required)
      "discountedPrice": "Number", // Discounted price (required)
      "discountPercentage": "Number", // Auto-calculated discount percentage
      "isActive": "Boolean", // Whether this specific price is active
      "name": "String", // Price name/identifier (required)
      "description": "String" // Optional description
    }
  ],
  "isActive": "Boolean", // Whether the entire price configuration is active
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## API Endpoints

### 1. Get All Prices (Public)

**GET** `/api/prices`

Retrieve all active prices in the array.

**Response:**

```json
{
  "message": "Prices retrieved successfully",
  "prices": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "originalPrice": 1000,
      "discountedPrice": 800,
      "discountPercentage": 20,
      "isActive": true,
      "name": "Gold Ring Price",
      "description": "Price for gold rings"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "originalPrice": 1500,
      "discountedPrice": 1200,
      "discountPercentage": 20,
      "isActive": true,
      "name": "Diamond Ring Price",
      "description": "Price for diamond rings"
    }
  ]
}
```

### 2. Add New Price (Protected - Admin)

**POST** `/api/prices/add`

Add a new price to the array.

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "originalPrice": 2000,
  "discountedPrice": 1600,
  "name": "Platinum Ring Price",
  "description": "Price for platinum rings"
}
```

**Validation:**

- `originalPrice`: Required, must be greater than 0
- `discountedPrice`: Required, must be greater than 0 and less than originalPrice
- `name`: Required, unique identifier for the price
- `description`: Optional

**Response:**

```json
{
  "message": "Price added successfully",
  "price": {
    "_id": "507f1f77bcf86cd799439013",
    "originalPrice": 2000,
    "discountedPrice": 1600,
    "discountPercentage": 20,
    "isActive": true,
    "name": "Platinum Ring Price",
    "description": "Price for platinum rings"
  },
  "totalPrices": 3
}
```

### 3. Update Price by ID (Protected - Admin)

**PUT** `/api/prices/update/:priceId`

Update a specific price by its unique ID.

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Parameters:**

- `priceId`: Unique ID of the price (MongoDB ObjectId)

**Request Body:**

```json
{
  "originalPrice": 1800,
  "discountedPrice": 1400,
  "name": "Updated Gold Ring Price",
  "description": "Updated price for gold rings"
}
```

**Response:**

```json
{
  "message": "Price updated successfully",
  "price": {
    "_id": "507f1f77bcf86cd799439011",
    "originalPrice": 1800,
    "discountedPrice": 1400,
    "discountPercentage": 22.22,
    "isActive": true,
    "name": "Updated Gold Ring Price",
    "description": "Updated price for gold rings"
  },
  "priceId": "507f1f77bcf86cd799439011"
}
```

### 4. Delete Price by ID (Protected - Admin)

**DELETE** `/api/prices/delete/:priceId`

Delete a specific price by its unique ID.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Parameters:**

- `priceId`: Unique ID of the price (MongoDB ObjectId)

**Response:**

```json
{
  "message": "Price deleted successfully",
  "deletedPrice": {
    "_id": "507f1f77bcf86cd799439011",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": true,
    "name": "Gold Ring Price",
    "description": "Price for gold rings"
  },
  "priceId": "507f1f77bcf86cd799439011",
  "remainingPrices": 2
}
```

### 5. Toggle Price Status by ID (Protected - Admin)

**PATCH** `/api/prices/toggle/:priceId`

Toggle the active status of a specific price by its unique ID.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Parameters:**

- `priceId`: Unique ID of the price (MongoDB ObjectId)

**Response:**

```json
{
  "message": "Price deactivated successfully",
  "price": {
    "_id": "507f1f77bcf86cd799439011",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": false,
    "name": "Gold Ring Price",
    "description": "Price for gold rings"
  },
  "priceId": "507f1f77bcf86cd799439011"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "originalPrice, discountedPrice, and name are required fields"
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
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found

```json
{
  "message": "No active price configuration found"
}
```

### 404 Price Not Found

```json
{
  "message": "Price not found with the provided ID"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error while adding price",
  "error": "Error details"
}
```

## Usage Examples

### Get all prices

```bash
curl -X GET "http://localhost:5001/api/prices"
```

### Add new price (requires admin token)

```bash
curl -X POST "http://localhost:5001/api/prices/add" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalPrice": 2000,
    "discountedPrice": 1600,
    "name": "Platinum Ring Price",
    "description": "Price for platinum rings"
  }'
```

### Update price by ID (requires admin token)

```bash
curl -X PUT "http://localhost:5001/api/prices/update/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalPrice": 1800,
    "discountedPrice": 1400,
    "name": "Updated Gold Ring Price"
  }'
```

### Delete price by ID (requires admin token)

```bash
curl -X DELETE "http://localhost:5001/api/prices/delete/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Toggle price status by ID (requires admin token)

```bash
curl -X PATCH "http://localhost:5001/api/prices/toggle/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Notes

1. **Array Management**: Prices are stored in an array with unique IDs for each price
2. **Auto-calculation**: Discount percentage is automatically calculated for each price
3. **Individual Status**: Each price can have its own active/inactive status
4. **ID-based Operations**: All operations use unique MongoDB ObjectIds for reliable identification
5. **Public Read Access**: Anyone can view prices without authentication
6. **Admin Write Access**: All write operations require admin privileges
7. **Unique IDs**: Each price has a unique MongoDB ObjectId for reliable operations
8. **No Index Errors**: Using IDs eliminates "index out of range" errors
