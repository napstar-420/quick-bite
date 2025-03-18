const { model, Schema } = require('mongoose');

const { genRestaurantBranchId } = require('../utils/id');

const RestaurantBranchSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => genRestaurantBranchId(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    restaurant: {
      type: String,
      ref: 'Restaurant',
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      ref: 'User',
      required: true,
    },
    staff: [
      {
        type: String,
        ref: 'User',
      },
    ],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    openingHours: [
      {
        days: {
          type: [String],
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: true,
        },
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    coverImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'closed', 'suspended'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// geospatial index for location-based queries
RestaurantBranchSchema.index({ location: '2dsphere' });

module.exports = model('RestaurantBranch', RestaurantBranchSchema);
