const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// Pre-save middleware to calculate discount percentage
priceSchema.pre('save', function (next) {
  // Calculate discount percentage
  if (this.originalPrice > 0) {
    this.discountPercentage =
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100;
  }

  next();
});

// Index for better query performance
priceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Price', priceSchema);
