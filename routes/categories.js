const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin authentication required)
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
