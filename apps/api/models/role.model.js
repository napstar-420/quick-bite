const { model, Schema } = require('mongoose');

const { genRoleId } = require('../utils/id');

const RoleSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => genRoleId(),
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
    permissions: [
      {
        type: String,
        ref: 'Permission',
      },
    ],
  },
  { timestamps: true },
);

module.exports = model('Role', RoleSchema);
