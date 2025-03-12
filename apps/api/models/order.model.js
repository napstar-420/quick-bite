import { model, Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        customizations: [
          {
            name: { type: String },
            option: { type: String },
            price: { type: Number, default: 0 },
          },
        ],
        totalPrice: { type: Number, required: true },
      },
    ],
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    tip: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'placed',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            'placed',
            'confirmed',
            'preparing',
            'ready_for_pickup',
            'out_for_delivery',
            'delivered',
            'cancelled',
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: { type: String },
      },
    ],
    specialInstructions: {
      type: String,
      trim: true,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    actualDeliveryTime: {
      type: Date,
    },
    discountCode: {
      type: String,
    },
  },
  { timestamps: true },
);

const Order = model('Order', orderSchema);

module.exports = Order;
