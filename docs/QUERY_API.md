# User Query API Documentation

## Overview

The User Query API provides a comprehensive support ticket system where users can create and manage support queries, while administrators can view, respond to, and manage all queries. The system includes status tracking, priority levels, categories, and admin responses.

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Query Status Flow

1. **open** - Query is created and waiting for admin response
2. **in_progress** - Admin is working on the query
3. **resolved** - Query has been resolved
4. **closed** - Query is closed (no further action needed)

## Priority Levels

- **low** - Non-urgent issues
- **medium** - Standard priority (default)
- **high** - Important issues
- **urgent** - Critical issues requiring immediate attention

## Categories

- **general** - General inquiries (default)
- **technical** - Technical issues
- **billing** - Payment and billing issues
- **order** - Order-related questions
- **product** - Product information
- **other** - Miscellaneous issues

---

## User Endpoints

### 1. Create a New Query

**POST** `/api/queries`

Create a new support query.

**Request Body:**

```json
{
  "subject": "Payment Issue with Order #12345",
  "message": "I'm having trouble with the payment for my recent order. The payment was deducted but the order status shows pending.",
  "category": "billing",
  "priority": "high",
  "tags": ["payment", "order-issue"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Query created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "subject": "Payment Issue with Order #12345",
    "message": "I'm having trouble with the payment for my recent order...",
    "category": "billing",
    "priority": "high",
    "status": "open",
    "tags": ["payment", "order-issue"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get My Queries

**GET** `/api/queries/my-queries`

Get all queries for the authenticated user with pagination and filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `category` (optional): Filter by category
- `priority` (optional): Filter by priority

**Example:**

```
GET /api/queries/my-queries?page=1&limit=5&status=open&category=billing
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "subject": "Payment Issue with Order #12345",
      "message": "I'm having trouble with the payment...",
      "category": "billing",
      "priority": "high",
      "status": "open",
      "adminResponse": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalQueries": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. Get Query by ID

**GET** `/api/queries/:id`

Get a specific query by ID (user can only access their own queries).

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "subject": "Payment Issue with Order #12345",
    "message": "I'm having trouble with the payment...",
    "category": "billing",
    "priority": "high",
    "status": "in_progress",
    "adminResponse": {
      "message": "We're investigating your payment issue. Please allow 24-48 hours for resolution.",
      "adminId": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Admin User"
      },
      "respondedAt": "2024-01-15T11:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 4. Update Query

**PUT** `/api/queries/:id`

Update a query (only if status is "open").

**Request Body:**

```json
{
  "subject": "Updated Payment Issue with Order #12345",
  "message": "Updated message with additional details...",
  "category": "billing",
  "priority": "urgent",
  "tags": ["payment", "order-issue", "urgent"]
}
```

### 5. Delete Query

**DELETE** `/api/queries/:id`

Delete a query (user can only delete their own queries).

**Response:**

```json
{
  "success": true,
  "message": "Query deleted successfully"
}
```

---

## Admin Endpoints

### 1. Get All Queries (Admin)

**GET** `/api/queries/admin/all`

Get all queries with advanced filtering and search.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `category` (optional): Filter by category
- `priority` (optional): Filter by priority
- `userId` (optional): Filter by user ID
- `search` (optional): Search in subject and message
- `sortBy` (optional): Sort field (default: "createdAt")
- `sortOrder` (optional): Sort order "asc" or "desc" (default: "desc")

**Example:**

```
GET /api/queries/admin/all?page=1&limit=10&status=open&search=payment&sortBy=priority&sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "user": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "subject": "Payment Issue with Order #12345",
      "message": "I'm having trouble with the payment...",
      "category": "billing",
      "priority": "high",
      "status": "open",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalQueries": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "statistics": [
    {
      "_id": "open",
      "count": 25
    },
    {
      "_id": "in_progress",
      "count": 15
    },
    {
      "_id": "resolved",
      "count": 8
    },
    {
      "_id": "closed",
      "count": 2
    }
  ]
}
```

### 2. Update Query (Admin)

**PUT** `/api/queries/admin/:id`

Update query status and add admin response.

**Request Body:**

```json
{
  "status": "in_progress",
  "adminResponse": "We're investigating your payment issue. Our team will contact you within 24 hours with an update."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Query updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "in_progress",
    "adminResponse": {
      "message": "We're investigating your payment issue...",
      "adminId": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Admin User"
      },
      "respondedAt": "2024-01-15T11:00:00.000Z"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 3. Get Query Statistics (Admin)

**GET** `/api/queries/admin/stats`

Get comprehensive query statistics.

**Query Parameters:**

- `period` (optional): Number of days to analyze (default: 30)

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "recentQueries": 150,
    "statusBreakdown": [
      {
        "_id": "open",
        "categories": [
          {
            "category": "billing",
            "priority": "high",
            "count": 25
          }
        ],
        "totalCount": 45
      }
    ],
    "averageResponseTime": 86400000
  }
}
```

### 4. Bulk Update Queries (Admin)

**PUT** `/api/queries/admin/bulk-update`

Update multiple queries at once.

**Request Body:**

```json
{
  "queryIds": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
  "status": "resolved",
  "adminResponse": "All payment issues have been resolved. Please check your order status."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully updated 2 queries",
  "data": {
    "modifiedCount": 2,
    "matchedCount": 2
  }
}
```

---

## Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Server error while creating query",
  "error": "ValidationError: Query validation failed: subject: Path `subject` is required."
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "Query not found"
}
```

### Authorization Error

```json
{
  "success": false,
  "message": "Not authorized to access this query"
}
```

### Status Update Error

```json
{
  "success": false,
  "message": "Cannot update query that is not in open status"
}
```

---

## Usage Examples

### User Workflow

1. **Create Query**: User creates a new query about a payment issue
2. **Check Status**: User checks their queries to see admin responses
3. **Update Query**: User can update their query if it's still open
4. **Get Response**: User receives admin response and status updates

### Admin Workflow

1. **View All Queries**: Admin sees all queries with filtering options
2. **Filter by Priority**: Admin can focus on urgent queries first
3. **Update Status**: Admin updates query status and adds response
4. **Bulk Operations**: Admin can handle multiple queries efficiently
5. **Monitor Statistics**: Admin tracks response times and query volumes

---

## Database Schema

### Query Model

```javascript
{
  user: ObjectId,           // Reference to User
  subject: String,          // Query subject (5-100 chars)
  message: String,          // Query message (10-1000 chars)
  category: String,         // general, technical, billing, order, product, other
  priority: String,         // low, medium, high, urgent
  status: String,           // open, in_progress, resolved, closed
  adminResponse: {
    message: String,        // Admin response message
    adminId: ObjectId,      // Reference to admin User
    respondedAt: Date       // Response timestamp
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  tags: [String],           // Array of tags
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

---

## Notes

- Users can only access and modify their own queries
- Admins can access and modify all queries
- Queries can only be updated by users when status is "open"
- Admin responses are automatically timestamped
- The system includes comprehensive validation and error handling
- All endpoints support pagination for better performance
- Database indexes are optimized for common query patterns
- Virtual fields provide time calculations for analytics
