const { compare, genSalt, hash } = require("bcryptjs");
const { model, Schema } = require("mongoose");

const config = require("../config");
const { genUserId } = require("../utils/id");

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
      minlength: config.USER_PASS_MIN_LENGTH,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
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
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
            index: "2dsphere",
          },
        },
      },
    ],
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password"))
    return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
