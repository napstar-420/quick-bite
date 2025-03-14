const { model, Schema } = require('mongoose');

const config = require('../config');
const { hashPassword } = require('../utils/helpers');
const { genUserId } = require('../utils/id');

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => genUserId(),
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
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: config.PASS_MIN_LENGTH,
      maxlength: config.PASS_MAX_LENGTH,
    },
    roles: [{
      type: String,
      ref: 'Role',
    }],
    refreshToken: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastActive: {
      type: Date,
      default: Date.now(),
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        label: { type: String, required: true },
        title: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        location: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
          },
          coordinates: {
            type: [Number],
            index: '2dsphere',
          },
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

UserSchema.virtual('status').get(function () {
  if (this.suspended) {
    return 'suspended';
  }

  if (this.lastActive) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (this.lastActive < thirtyDaysAgo) {
      return 'inactive';
    }
  }

  return 'active';
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

module.exports = model('User', UserSchema);
