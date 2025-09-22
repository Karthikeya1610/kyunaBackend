# Price API Documentation

This document describes the Price API endpoints for managing global pricing with original and discounted prices.

## Base URL

```
http://localhost:5001/api/prices
```

## Authentication

- **Read operations**: No authentication required (public access)
- **Write operations**: Requires authentication token and admin privileges

## Data Model

### Price Schema

```json
{
  "originalPrice": "Number", // Original price (required)
  "discountedPrice": "Number", // Discounted price (required)
  "discountPercentage": "Number", // Auto-calculated discount percentage
  "isActive": "Boolean", // Whether price is active (default: true)
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## API Endpoints

### 1. Get All Prices (Public)

**GET** `/api/prices`

Retrieve all prices with optional filtering and pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `isActive` (optional): Filter by active status (true/false)
- `minDiscountPercentage` (optional): Minimum discount percentage
- `maxDiscountPercentage` (optional): Maximum discount percentage
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - desc/asc (default: desc)

**Response:**

```json
{
  "message": "Prices retrieved successfully",
  "prices": [
    {
      "_id": "price_id",
      "originalPrice": 1000,
      "discountedPrice": 800,
      "discountPercentage": 20,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPrices": 50,
    "pricesPerPage": 10
  }
}
```

### 2. Get Price by ID (Public)

**GET** `/api/prices/:id`

Retrieve a specific price by its ID.

**Parameters:**

- `id`: Price ID

**Response:**

```json
{
  "message": "Price retrieved successfully",
  "price": {
    "_id": "price_id",
    "itemId": "item_id",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Active Global Price (Public)

**GET** `/api/prices/active`

Retrieve the currently active global price.

**Response:**

```json
{
  "message": "Active global price retrieved successfully",
  "price": {
    "_id": "price_id",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Create Price (Protected - Admin)

**POST** `/api/prices`

Create a new global price.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "originalPrice": 1000,
  "discountedPrice": 800
}
```

**Validation:**

- `originalPrice`: Required, must be greater than 0
- `discountedPrice`: Required, must be greater than 0 and less than originalPrice
- Only one active global price allowed

**Response:**

```json
{
  "message": "Price created successfully",
  "price": {
    "_id": "price_id",
    "itemId": "item_id",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Update Price (Protected - Admin)

**PUT** `/api/prices/:id`

Update an existing price.

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id`: Price ID

**Request Body:**

```json
{
  "originalPrice": 1200,
  "discountedPrice": 900
}
```

**Validation:**

- `originalPrice`: Must be greater than 0
- `discountedPrice`: Must be greater than 0 and less than originalPrice

**Response:**

```json
{
  "message": "Price updated successfully",
  "price": {
    "_id": "price_id",
    "itemId": "item_id",
    "originalPrice": 1200,
    "discountedPrice": 900,
    "discountPercentage": 25,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Delete Price (Protected - Admin)

**DELETE** `/api/prices/:id`

Delete a price permanently.

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id`: Price ID

**Response:**

```json
{
  "message": "Price deleted successfully",
  "price": {
    "_id": "price_id",
    "itemId": "item_id",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Toggle Price Status (Protected - Admin)

**PATCH** `/api/prices/:id/toggle`

Toggle the active status of a price.

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id`: Price ID

**Response:**

```json
{
  "message": "Price activated successfully",
  "price": {
    "_id": "price_id",
    "itemId": "item_id",
    "originalPrice": 1000,
    "discountedPrice": 800,
    "discountPercentage": 20,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "itemId, originalPrice, and discountedPrice are required fields"
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
  "message": "Price not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error while creating price",
  "error": "Error details"
}
```

## Usage Examples

### Get all active prices

```bash
curl -X GET "http://localhost:5001/api/prices?isActive=true"
```

### Get price for specific item

```bash
curl -X GET "http://localhost:5001/api/prices/item/ITEM_ID"
```

### Create new price (requires admin token)

```bash
curl -X POST "http://localhost:5001/api/prices" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "ITEM_ID",
    "originalPrice": 1000,
    "discountedPrice": 800
  }'
```

### Update price (requires admin token)

```bash
curl -X PUT "http://localhost:5001/api/prices/PRICE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalPrice": 1200,
    "discountedPrice": 900
  }'
```

## Notes

1. **Discount Calculation**: The discount percentage is automatically calculated as `((originalPrice - discountedPrice) / originalPrice) * 100`

2. **One Active Price Per Item**: Only one active price is allowed per item. To create a new active price, first deactivate the existing one.

3. **Price Validation**: Discounted price must always be less than the original price.

4. **Public Read Access**: All read operations are public and don't require authentication.

5. **Admin Write Access**: All write operations (create, update, delete) require admin privileges.
