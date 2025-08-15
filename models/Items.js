const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null }, 
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  availability: { 
    type: String, 
    enum: ["In Stock", "Out of Stock"], 
    default: "In Stock" 
  },

  images: { 
    type: [String], 
    default: [] 
  },

  description: { type: String, default: "" },

  specifications: {
    type: Map,
    of: String
  },

  ratingBreakdown: {
    type: Map,
    of: Number,
    default: {}
  },

  // For S3 bucket integration later
  s3ImageKeys: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
