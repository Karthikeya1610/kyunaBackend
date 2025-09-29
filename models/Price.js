const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
  {
    prices: [
      {
        originalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        discountedPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        discountPercentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate discount percentage for each price
priceSchema.pre('save', function (next) {
  this.prices.forEach(price => {
    if (price.originalPrice > 0) {
      price.discountPercentage =
        ((price.originalPrice - price.discountedPrice) / price.originalPrice) *
        100;
    }
  });
  next();
});

// Index for better query performance
priceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Price', priceSchema);
