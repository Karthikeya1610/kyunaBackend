const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ['general', 'technical', 'billing', 'order', 'product', 'other'],
      default: 'general',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      required: true,
      index: true,
    },
    adminResponse: {
      message: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: {
        type: Date,
      },
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
querySchema.index({ createdAt: -1 });
querySchema.index({ status: 1, priority: 1 });
querySchema.index({ user: 1, createdAt: -1 });

// Virtual for time since creation
querySchema.virtual('timeSinceCreation').get(function () {
  return Date.now() - this.createdAt;
});

// Virtual for time since last update
querySchema.virtual('timeSinceUpdate').get(function () {
  return Date.now() - this.updatedAt;
});

module.exports = mongoose.model('Query', querySchema);
