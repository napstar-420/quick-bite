const { model, Schema } = require('mongoose');

const { genRestaurantId } = require('../utils/id');

const restaurantSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => genRestaurantId(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.String,
      ref: 'User',
      required: true,
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    categories: [
      {
        type: Schema.Types.String,
        ref: 'RestaurantCategory',
      },
    ],
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'under-review',
        'approved',
        'rejected',
        'closed',
        'suspended',
      ],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// geospatial index for location-based queries
restaurantSchema.index({ location: '2dsphere' });

module.exports = model('Restaurant', restaurantSchema);
