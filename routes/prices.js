const express = require('express');
const router = express.Router();
const {
  getPrices,
  addPrice,
  updatePrice,
  deletePrice,
  togglePriceStatus,
} = require('../controllers/priceController');
const { protect, admin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getPrices);

// Protected routes (authentication required)
router.post('/add', protect, admin, addPrice);
router.put('/update/:priceIndex', protect, admin, updatePrice);
router.delete('/delete/:priceIndex', protect, admin, deletePrice);
router.patch('/toggle/:priceIndex', protect, admin, togglePriceStatus);

module.exports = router;
