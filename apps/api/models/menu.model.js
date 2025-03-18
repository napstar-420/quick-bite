const { Schema, model } = require('mongoose');

const { generateId } = require('../utils/id');

const MenuSchema = new Schema(
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

    branches: [
      {
        type: String,
        ref: 'RestaurantBranch',
        required: true,
      },
    ],

    menuItems: [
      {
        type: String,
        ref: 'MenuItem',
      },
    ],

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

module.exports = model('Menu', MenuSchema);
