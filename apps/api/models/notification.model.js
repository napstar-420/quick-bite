import { model, Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['User', 'Restaurant', 'DeliveryPerson'],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'order_update',
        'delivery_update',
        'promotion',
        'system',
        'payment',
      ],
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Order', 'Restaurant', 'DeliveryPerson', 'Discount'],
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = model('Notification', notificationSchema);
