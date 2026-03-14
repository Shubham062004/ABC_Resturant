const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  address: {
    street: String,
    city: String,
    zip: String
  },
  paymentMethod: {
    type: String,
    enum: ["ONLINE", "COD"],
    required: true
  },
  deliveryType: {
    type: String,
    enum: ["DELIVERY", "TAKEAWAY"],
    required: true
  },
  status: {
    type: String,
    enum: [
      "ORDER_RECEIVED",
      "PREPARING",
      "READY",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED"
    ],
    default: "ORDER_RECEIVED"
  },
  estimatedTime: {
    type: Number // in minutes
  }
}, {
  timestamps: true
});

// Add logic-heavy indexes for performance
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
