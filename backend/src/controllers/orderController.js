const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod, deliveryType, subtotal, discount, deliveryFee, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Generate Order ID ABC-XXXX
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ABC-${random}`;

    const order = await Order.create({
      orderId,
      customer: req.user.id,
      items,
      address,
      paymentMethod,
      deliveryType,
      subtotal,
      discount: discount || 0,
      deliveryFee: deliveryFee || 0,
      total,
      estimatedTime: 30
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user is authorized to see this order
    if (order.customer._id.toString() !== req.user.id && !['manager', 'owner', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer order history
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Staff/Manager)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Manager)
// @route   GET /api/orders
// @access  Private (Manager/Owner)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name').sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders filtered by status
// @route   GET /api/orders/status/:status
// @access  Private (Manager/Owner)
exports.getOrdersByStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status }).populate('customer', 'name').sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders for kitchen queue
// @route   GET /api/orders/kitchen
// @access  Private (Kitchen/Manager)
exports.getOrdersForKitchen = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['ORDER_RECEIVED', 'PREPARING'] }
    }).sort('createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private (Manager/Owner)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'CANCELLED' }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reorder from previous order
// @route   POST /api/orders/reorder/:id
// @access  Private
exports.reorder = async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ABC-${random}`;

    const newOrder = await Order.create({
      orderId,
      customer: req.user.id,
      items: oldOrder.items,
      address: oldOrder.address,
      paymentMethod: oldOrder.paymentMethod,
      deliveryType: oldOrder.deliveryType,
      subtotal: oldOrder.subtotal,
      discount: oldOrder.discount,
      deliveryFee: oldOrder.deliveryFee,
      total: oldOrder.total,
      estimatedTime: 30
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
