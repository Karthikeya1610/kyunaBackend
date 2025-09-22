const express = require('express');
const router = express.Router();
const {
  createPrice,
  getAllPrices,
  getPriceById,
  getActivePrice,
  updatePrice,
  deletePrice,
  togglePriceStatus,
} = require('../controllers/priceController');
const { protect, admin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllPrices);
router.get('/active', getActivePrice);
router.get('/:id', getPriceById);

// Protected routes (authentication required)
router.post('/', protect, admin, createPrice);
router.put('/:id', protect, admin, updatePrice);
router.delete('/:id', protect, admin, deletePrice);
router.patch('/:id/toggle', protect, admin, togglePriceStatus);

module.exports = router;
