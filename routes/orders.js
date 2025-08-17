const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  adminCancelOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// User routes (authenticated users)
router.post('/', protect, createOrder); // Create new order
router.get('/my-orders', protect, getUserOrders); // Get user's own orders
router.get('/:id', protect, getOrderById); // Get specific order by ID
router.put('/:id/cancel', protect, cancelOrder); // Cancel order

// Admin routes (admin only)
router.get('/', protect, admin, getAllOrders); // Get all orders with filtering
router.put('/:id/status', protect, admin, updateOrderStatus); // Update order status
router.put('/:id/admin-cancel', protect, admin, adminCancelOrder); // Admin cancel order
router.get('/stats/overview', protect, admin, getOrderStats); // Get order statistics

module.exports = router;
