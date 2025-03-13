const { Schema, model } = require('mongoose');

const menuItemSchema = new Schema(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    customizations: [
      {
        name: { type: String, required: true },
        options: [
          {
            name: { type: String, required: true },
            price: { type: Number, default: 0, min: 0 },
          },
        ],
      },
    ],
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

module.exports = model('MenuItem', menuItemSchema);
