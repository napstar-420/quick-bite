const { model, Schema } = require('mongoose');

const reviewSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    deliveryPerson: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryPerson',
    },
    foodRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String,
      },
    ],
    restaurantReply: {
      text: { type: String },
      date: { type: Date },
    },
    isPublished: {
      type: Boolean,
      default: true,
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

module.exports = model('Review', reviewSchema);
