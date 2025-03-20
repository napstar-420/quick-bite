const { Schema, model } = require('mongoose');

const { generateId } = require('../utils/id');

const menuItemSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => generateId(),
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    isAvailable: {
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

module.exports = model('MenuItem', menuItemSchema);
