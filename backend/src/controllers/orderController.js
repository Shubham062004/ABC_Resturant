const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Valid status transitions
const VALID_TRANSITIONS = {
  'ORDER_RECEIVED': ['PREPARING', 'CANCELLED'],
  'PREPARING': ['READY', 'CANCELLED'],
  'READY': ['OUT_FOR_DELIVERY', 'CANCELLED'],
  'OUT_FOR_DELIVERY': ['DELIVERED', 'CANCELLED'],
  'DELIVERED': [],
  'CANCELLED': []
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod, deliveryType, discount, deliveryFee } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // 1. Server-side Price Calculation
    let calculatedSubtotal = 0;
    const itemsWithPrices = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item ${item.menuItemId} not found` });
      }
      
      const price = menuItem.price;
      calculatedSubtotal += price * item.quantity;
      
      itemsWithPrices.push({
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: price,
        quantity: item.quantity
      });
    }

    const calculatedTotal = calculatedSubtotal - (discount || 0) + (deliveryFee || 0);

    // 2. Generate Order ID ABC-XXXX
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ABC-${random}`;

    const order = await Order.create({
      orderId,
      customer: req.user.id,
      items: itemsWithPrices,
      address,
      paymentMethod,
      deliveryType,
      subtotal: calculatedSubtotal,
      discount: discount || 0,
      deliveryFee: deliveryFee || 0,
      total: calculatedTotal,
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
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Enforce status transition rules
    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status transition from ${order.status} to ${status}` 
      });
    }

    order.status = status;
    await order.save();

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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find()
      .populate('customer', 'name')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({ 
      success: true, 
      count: orders.length, 
      page,
      totalPages,
      totalOrders,
      data: orders 
    });
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
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a delivered or already cancelled order' });
    }

    order.status = 'CANCELLED';
    await order.save();

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
