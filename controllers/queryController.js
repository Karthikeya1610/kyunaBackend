const Query = require('../models/Query');
const User = require('../models/User');

// @desc    Create a new query (User)
// @route   POST /api/queries
// @access  Private (User)
const createQuery = async (req, res) => {
  try {
    const { subject, message, category, priority, tags } = req.body;

    const query = await Query.create({
      user: req.user.id,
      subject,
      message,
      category: category || 'general',
      priority: priority || 'medium',
      tags: tags || [],
    });

    await query.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Query created successfully',
      data: query,
    });
  } catch (error) {
    console.error('createQuery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating query',
      error: error.message,
    });
  }
};

// @desc    Get all queries for a user
// @route   GET /api/queries/my-queries
// @access  Private (User)
const getMyQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority } = req.query;

    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const queries = await Query.find(filter)
      .populate('user', 'name email')
      .populate('adminResponse.adminId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Query.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: queries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQueries: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('getMyQueries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching queries',
      error: error.message,
    });
  }
};

// @desc    Get a single query by ID (User can only see their own queries)
// @route   GET /api/queries/:id
// @access  Private (User)
const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('user', 'name email')
      .populate('adminResponse.adminId', 'name');

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    // Check if user owns this query or is admin
    if (
      query.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this query',
      });
    }

    res.status(200).json({
      success: true,
      data: query,
    });
  } catch (error) {
    console.error('getQueryById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching query',
      error: error.message,
    });
  }
};

// @desc    Update a query (User can only update their own queries)
// @route   PUT /api/queries/:id
// @access  Private (User)
const updateQuery = async (req, res) => {
  try {
    const { subject, message, category, priority, tags } = req.body;

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    // Check if user owns this query
    if (query.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this query',
      });
    }

    // Only allow updates if query is still open
    if (query.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update query that is not in open status',
      });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      {
        subject,
        message,
        category,
        priority,
        tags,
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Query updated successfully',
      data: updatedQuery,
    });
  } catch (error) {
    console.error('updateQuery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating query',
      error: error.message,
    });
  }
};

// @desc    Delete a query (User can only delete their own queries)
// @route   DELETE /api/queries/:id
// @access  Private (User)
const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    // Check if user owns this query
    if (query.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this query',
      });
    }

    await Query.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Query deleted successfully',
    });
  } catch (error) {
    console.error('deleteQuery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting query',
      error: error.message,
    });
  }
};

// ========== ADMIN CONTROLLERS ==========

// @desc    Get all queries (Admin)
// @route   GET /api/admin/queries
// @access  Private (Admin)
const getAllQueries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (userId) filter.user = userId;

    // Search functionality
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const queries = await Query.find(filter)
      .populate('user', 'name email')
      .populate('adminResponse.adminId', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Query.countDocuments(filter);

    // Get statistics
    const stats = await Query.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: queries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQueries: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      statistics: stats,
    });
  } catch (error) {
    console.error('getAllQueries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching queries',
      error: error.message,
    });
  }
};

// @desc    Update query status and add admin response (Admin)
// @route   PUT /api/admin/queries/:id
// @access  Private (Admin)
const adminUpdateQuery = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    if (adminResponse) {
      updateData.adminResponse = {
        message: adminResponse,
        adminId: req.user.id,
        respondedAt: new Date(),
      };
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('adminResponse.adminId', 'name');

    res.status(200).json({
      success: true,
      message: 'Query updated successfully',
      data: updatedQuery,
    });
  } catch (error) {
    console.error('adminUpdateQuery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating query',
      error: error.message,
    });
  }
};

// @desc    Get query statistics (Admin)
// @route   GET /api/admin/queries/stats
// @access  Private (Admin)
const getQueryStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Query.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            status: '$status',
            category: '$category',
            priority: '$priority',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.status',
          categories: {
            $push: {
              category: '$_id.category',
              priority: '$_id.priority',
              count: '$count',
            },
          },
          totalCount: { $sum: '$count' },
        },
      },
    ]);

    // Get recent queries count
    const recentQueries = await Query.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get average response time
    const avgResponseTime = await Query.aggregate([
      {
        $match: {
          'adminResponse.respondedAt': { $exists: true },
        },
      },
      {
        $addFields: {
          responseTime: {
            $subtract: ['$adminResponse.respondedAt', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: `${period} days`,
        recentQueries,
        statusBreakdown: stats,
        averageResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
      },
    });
  } catch (error) {
    console.error('getQueryStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message,
    });
  }
};

// @desc    Bulk update query status (Admin)
// @route   PUT /api/admin/queries/bulk-update
// @access  Private (Admin)
const bulkUpdateQueries = async (req, res) => {
  try {
    const { queryIds, status, adminResponse } = req.body;

    if (!queryIds || !Array.isArray(queryIds) || queryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid query IDs',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminResponse) {
      updateData.adminResponse = {
        message: adminResponse,
        adminId: req.user.id,
        respondedAt: new Date(),
      };
    }

    const result = await Query.updateMany(
      { _id: { $in: queryIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} queries`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
    });
  } catch (error) {
    console.error('bulkUpdateQueries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while bulk updating queries',
      error: error.message,
    });
  }
};

module.exports = {
  // User controllers
  createQuery,
  getMyQueries,
  getQueryById,
  updateQuery,
  deleteQuery,

  // Admin controllers
  getAllQueries,
  adminUpdateQuery,
  getQueryStats,
  bulkUpdateQueries,
};
