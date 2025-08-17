const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock'],
      default: 'In Stock',
    },

    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],

    description: { type: String, default: '' },

    specifications: {
      type: Map,
      of: String,
    },

    ratingBreakdown: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
