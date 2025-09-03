const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
      minlength: [2, 'Category name must be at least 2 characters long'],
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
