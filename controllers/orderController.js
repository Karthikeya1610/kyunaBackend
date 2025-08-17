const Order = require('../models/Order');
const Item = require('../models/Items');

// Create a new order (User)
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      notes,
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: 'Order items are required',
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: 'Shipping address is required',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: 'Payment method is required',
      });
    }

    // Validate order items and check availability
    for (const item of orderItems) {
      const dbItem = await Item.findById(item.item);
      if (!dbItem) {
        return res.status(400).json({
          message: `Item ${item.name} not found`,
        });
      }

      if (dbItem.availability === 'Out of Stock') {
        return res.status(400).json({
          message: `Item ${item.name} is out of stock`,
        });
      }

      // Use discount price if available, otherwise use regular price
      const itemPrice = dbItem.discountPrice || dbItem.price;
      if (item.price !== itemPrice) {
        return res.status(400).json({
          message: `Price mismatch for item ${item.name}`,
        });
      }
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      notes,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({
      message: 'Server error while creating order',
      error: error.message,
    });
  }
};

// Get user's orders (User)
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build filter object
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('orderItems.item', 'name price images')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        ordersPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('getUserOrders error:', error);
    res.status(500).json({
      message: 'Server error while retrieving orders',
      error: error.message,
    });
  }
};

// Get order by ID (User - their own order)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate(
        'orderItems.item',
        'name price images description specifications'
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Check if user owns this order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own orders.',
      });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order,
    });
  } catch (error) {
    console.error('getOrderById error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid order ID format',
      });
    }
    res.status(500).json({
      message: 'Server error while retrieving order',
      error: error.message,
    });
  }
};

// Cancel order (User - their own order)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only cancel your own orders.',
      });
    }

    // Check if order can be cancelled
    if (order.status === 'Cancelled') {
      return res.status(400).json({
        message: 'Order is already cancelled',
      });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({
        message: 'Cannot cancel delivered order',
      });
    }

    if (order.status === 'Shipped') {
      return res.status(400).json({
        message: 'Cannot cancel shipped order. Please contact support.',
      });
    }

    // Update order status
    order.status = 'Cancelled';
    order.cancellationReason = cancellationReason || 'Cancelled by user';
    order.cancelledBy = 'user';
    order.cancelledAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('cancelOrder error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid order ID format',
      });
    }
    res.status(500).json({
      message: 'Server error while cancelling order',
      error: error.message,
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      city,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.user = userId;
    }

    if (city) {
      filter['shippingAddress.city'] = new RegExp(city, 'i');
    }

    if (minPrice || maxPrice) {
      filter.totalPrice = {};
      if (minPrice) filter.totalPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.totalPrice.$lte = parseFloat(maxPrice);
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.item', 'name price images')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        ordersPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({
      message: 'Server error while retrieving orders',
      error: error.message,
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        message: 'Status is required',
      });
    }

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Refunded',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Update order status and related fields
    order.status = status;
    if (notes) order.notes = notes;

    // Update delivery status
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    // Update cancellation if status is cancelled
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      order.cancelledBy = 'admin';
      order.cancelledAt = new Date();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid order ID format',
      });
    }
    res.status(500).json({
      message: 'Server error while updating order status',
      error: error.message,
    });
  }
};

// Get order statistics (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get orders within the period
    const orders = await Order.find({
      createdAt: { $gte: startDate },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status breakdown
    const statusBreakdown = {};
    orders.forEach(order => {
      statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;
    });

    // Daily revenue for the period
    const dailyRevenue = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalPrice;
    });

    res.status(200).json({
      message: 'Order statistics retrieved successfully',
      stats: {
        period: `${period} days`,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
        statusBreakdown,
        dailyRevenue,
      },
    });
  } catch (error) {
    console.error('getOrderStats error:', error);
    res.status(500).json({
      message: 'Server error while retrieving order statistics',
      error: error.message,
    });
  }
};

// Admin cancel order
const adminCancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    if (!cancellationReason) {
      return res.status(400).json({
        message: 'Cancellation reason is required',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        message: 'Order is already cancelled',
      });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({
        message: 'Cannot cancel delivered order',
      });
    }

    // Update order status
    order.status = 'Cancelled';
    order.cancellationReason = cancellationReason;
    order.cancelledBy = 'admin';
    order.cancelledAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully by admin',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('adminCancelOrder error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid order ID format',
      });
    }
    res.status(500).json({
      message: 'Server error while cancelling order',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  adminCancelOrder,
};
