const express = require('express');
const router = express.Router();
const {
  getPrices,
  addPrice,
  updatePriceById,
  deletePriceById,
  togglePriceStatusById,
} = require('../controllers/priceController');
const { protect, admin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getPrices);

// Protected routes (authentication required)
router.post('/add', protect, admin, addPrice);

// ID-based routes
router.put('/update/:priceId', protect, admin, updatePriceById);
router.delete('/delete/:priceId', protect, admin, deletePriceById);
router.patch('/toggle/:priceId', protect, admin, togglePriceStatusById);

module.exports = router;
