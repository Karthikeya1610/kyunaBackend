const express = require('express');
const router = express.Router();
const {
  createQuery,
  getMyQueries,
  getQueryById,
  updateQuery,
  deleteQuery,
  getAllQueries,
  adminUpdateQuery,
  getQueryStats,
  bulkUpdateQueries,
} = require('../controllers/queryController');
const { protect, admin } = require('../middleware/auth');

/**
 * =====================================
 *               User Routes
 * =====================================
 */
router.post('/', protect, createQuery); // Create new query
router.get('/my-queries', protect, getMyQueries); // Get user's own queries
router.get('/:id', protect, getQueryById); // Get specific query by ID
router.put('/:id', protect, updateQuery); // Update query
router.delete('/:id', protect, deleteQuery); // Delete query

/**
 * =====================================
 *               Admin Routes
 * =====================================
 */
router.get('/admin/all', protect, admin, getAllQueries); // Get all queries with filtering
router.put('/admin/:id', protect, admin, adminUpdateQuery); // Update query status and add response
router.get('/admin/stats', protect, admin, getQueryStats); // Get query statistics
router.put('/admin/bulk-update', protect, admin, bulkUpdateQueries); // Bulk update queries

module.exports = router;
