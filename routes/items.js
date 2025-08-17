const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getItemsByCategory,
  searchItems,
} = require('../controllers/itemController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createItem);
router.get('/', getAllItems);
router.get('/search', searchItems);
router.get('/category/:category', getItemsByCategory);
router.get('/:id', getItemById);
router.put('/:id', protect, admin, updateItem);
router.delete('/:id', protect, admin, deleteItem);
module.exports = router;
