const { model, Schema } = require('mongoose');

const { genPermissionId } = require('../utils/id');

const PermissionSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => genPermissionId(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['create', 'read', 'update', 'delete', 'manage'],
      trim: true,
    },
    scope: {
      type: String,
      required: true,
      enum: ['global', 'own'],
      trim: true,
    },
  },
  { timestamps: true },
);

// Create a compound index on resource and action for faster lookups
PermissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = model('Permission', PermissionSchema);
