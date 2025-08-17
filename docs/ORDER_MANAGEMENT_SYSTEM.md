# 🛒 Order Management System - Complete Guide

This document provides a comprehensive overview of the Order Management System implemented in the Kyuna Jewellery Backend.

## 🎯 **System Overview**

The Order Management System allows users to create orders, cancel their own orders, and provides administrators with comprehensive order management capabilities including status updates, order tracking, and analytics.

## 🔐 **Access Control**

### **User Access (Authenticated Users)**

- ✅ Create new orders
- ✅ View their own orders
- ✅ Cancel their own orders (with restrictions)
- ✅ View order details

### **Admin Access (Admin Users Only)**

- ✅ View all orders with advanced filtering
- ✅ Update order statuses
- ✅ Cancel orders on behalf of users
- ✅ Access order statistics and analytics
- ✅ Manage order lifecycle

## 📋 **Order Lifecycle**

```
Pending → Confirmed → Processing → Shipped → Delivered
    ↓
Cancelled (by user or admin)
    ↓
Refunded (if applicable)
```

## 🚀 **API Endpoints**

### **User Endpoints**

| Method | Endpoint                 | Description        | Auth Required |
| ------ | ------------------------ | ------------------ | ------------- |
| `POST` | `/api/orders`            | Create new order   | ✅ User       |
| `GET`  | `/api/orders/my-orders`  | Get user's orders  | ✅ User       |
| `GET`  | `/api/orders/:id`        | Get specific order | ✅ User       |
| `PUT`  | `/api/orders/:id/cancel` | Cancel order       | ✅ User       |

### **Admin Endpoints**

| Method | Endpoint                       | Description          | Auth Required |
| ------ | ------------------------------ | -------------------- | ------------- |
| `GET`  | `/api/orders`                  | Get all orders       | ✅ Admin      |
| `PUT`  | `/api/orders/:id/status`       | Update order status  | ✅ Admin      |
| `PUT`  | `/api/orders/:id/admin-cancel` | Admin cancel order   | ✅ Admin      |
| `GET`  | `/api/orders/stats/overview`   | Get order statistics | ✅ Admin      |

## 📊 **Order Statuses**

### **Available Statuses**

1. **Pending** - Order created, awaiting confirmation
2. **Confirmed** - Order confirmed by admin
3. **Processing** - Order being prepared
4. **Shipped** - Order shipped to customer
5. **Delivered** - Order successfully delivered
6. **Cancelled** - Order cancelled (by user or admin)
7. **Refunded** - Order refunded to customer

### **Status Transition Rules**

- **Users can cancel orders** only in `Pending`, `Confirmed`, or `Processing` status
- **Shipped orders** cannot be cancelled by users (contact support required)
- **Delivered orders** cannot be cancelled
- **Admins can update** any order status
- **Admins can cancel** orders in any status except `Delivered`

## 🏗️ **Data Model**

### **Order Schema**

```javascript
{
  user: ObjectId,           // Reference to User
  orderItems: [             // Array of ordered items
    {
      item: ObjectId,        // Reference to Item
      name: String,          // Item name
      price: Number,         // Item price
      quantity: Number,      // Quantity ordered
      image: String          // Item image URL
    }
  ],
  shippingAddress: {         // Shipping information
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,     // Payment method used
  itemsPrice: Number,        // Subtotal of items
  taxPrice: Number,          // Tax amount
  shippingPrice: Number,     // Shipping cost
  totalPrice: Number,        // Total order amount
  status: String,            // Current order status
  notes: String,             // Admin notes
  cancellationReason: String, // Reason for cancellation
  cancelledBy: String,       // Who cancelled (user/admin)
  cancelledAt: Date,         // When cancelled
  timestamps: {              // Created/updated dates
    createdAt: Date,
    updatedAt: Date
  }
}
```

## 🔍 **Advanced Filtering & Search**

### **Admin Order Filtering**

- **Status filtering** - Filter by order status
- **User filtering** - Filter by specific user
- **Location filtering** - Filter by shipping city
- **Price filtering** - Filter by total price range
- **Date filtering** - Filter by order creation date
- **Sorting** - Sort by any field (price, date, etc.)

### **User Order Filtering**

- **Status filtering** - Filter own orders by status
- **Pagination** - Browse through order history

## 📈 **Analytics & Statistics**

### **Order Statistics (Admin Only)**

- **Total orders** in specified period
- **Total revenue** generated
- **Average order value**
- **Status breakdown** - Count of orders by status
- **Daily revenue** tracking
- **Customizable periods** (7, 30, 90 days, etc.)

## 🛡️ **Security Features**

### **Data Protection**

- **User isolation** - Users can only access their own orders
- **Admin verification** - Admin-only endpoints protected
- **Input validation** - All order data validated
- **Price verification** - Item prices verified against database
- **Stock checking** - Out-of-stock items cannot be ordered

### **Business Logic Protection**

- **Cancellation restrictions** - Prevents invalid cancellations
- **Status validation** - Only valid status transitions allowed
- **Audit trail** - Tracks who made changes and when

## 🧪 **Testing Examples**

### **Create Order**

```bash
curl -X POST "http://localhost:5001/api/orders" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d @docs/sample_orders_data.json
```

### **Get User Orders**

```bash
curl -X GET "http://localhost:5001/api/orders/my-orders" \
  -H "Authorization: Bearer USER_TOKEN"
```

### **Cancel Order**

```bash
curl -X PUT "http://localhost:5001/api/orders/ORDER_ID/cancel" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cancellationReason": "Changed my mind"}'
```

### **Admin: Get All Orders**

```bash
curl -X GET "http://localhost:5001/api/orders?status=Pending&city=New York" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### **Admin: Update Order Status**

```bash
curl -X PUT "http://localhost:5001/api/orders/ORDER_ID/status" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Shipped", "notes": "Express delivery"}'
```

## 📁 **File Structure**

```
controllers/
├── orderController.js      # Order business logic
models/
├── Order.js               # Order data model
routes/
├── orders.js              # Order API routes
docs/
├── sample_orders_data.json # Sample order data for testing
└── ORDER_MANAGEMENT_SYSTEM.md # This documentation
```

## 🚀 **Getting Started**

1. **Ensure authentication middleware** is properly configured
2. **Create test users** with different roles (user/admin)
3. **Add sample items** to the database
4. **Test order creation** with sample data
5. **Test admin functions** with admin user
6. **Verify order lifecycle** and status transitions

## 🔧 **Configuration**

### **Environment Variables**

```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### **Database Indexes**

The Order model includes optimized indexes for:

- User queries (user + createdAt)
- Status filtering (status + createdAt)
- Location searches (shippingAddress.city)
- Price filtering (totalPrice)

## 📝 **Best Practices**

### **For Users**

- Always provide accurate shipping information
- Review order details before confirmation
- Contact support for shipped orders you need to cancel
- Keep order confirmation emails for reference

### **For Admins**

- Update order statuses promptly
- Add notes for important status changes
- Monitor order statistics regularly
- Handle cancellations with clear reasoning

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Order creation fails** - Check item availability and prices
2. **Cancellation denied** - Verify order status and user permissions
3. **Admin access denied** - Ensure user has admin role
4. **Filtering not working** - Check query parameter format

### **Debug Tips**

- Check authentication token validity
- Verify user role permissions
- Review order status transition rules
- Check database connection and indexes

---

## 📞 **Support**

For technical support or questions about the Order Management System:

- Review the API documentation
- Check the sample data files
- Test with the provided cURL examples
- Verify authentication and permissions

---

_Last Updated: January 2024_
_Version: 1.0.0_
