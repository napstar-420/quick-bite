import { Schema } from 'mongoose';

const deliveryPersonSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileImage: {
      type: String,
    },
    vehicleType: {
      type: String,
      enum: ['bicycle', 'motorcycle', 'car', 'van'],
      required: true,
    },
    vehicleNumber: {
      type: String,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    earnings: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Add geospatial index for location-based queries
deliveryPersonSchema.index({ currentLocation: '2dsphere' });

module.exports = model('DeliveryPerson', deliveryPersonSchema);
