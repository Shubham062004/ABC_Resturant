const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  getOrdersByStatus,
  getOrdersForKitchen,
  cancelOrder,
  reorder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const orderValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.menuItemId').isMongoId().withMessage('Valid Menu Item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('paymentMethod').isIn(['ONLINE', 'COD']).withMessage('Invalid payment method'),
  body('deliveryType').isIn(['DELIVERY', 'TAKEAWAY']).withMessage('Invalid delivery type'),
  validate
];

// Customer routes
router.post('/', protect, orderValidation, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/reorder/:id', protect, reorder);

// Management & Staff routes
router.get('/', protect, authorize('manager', 'owner'), getAllOrders);
router.get('/status/:status', protect, authorize('manager', 'owner'), getOrdersByStatus);
router.get('/kitchen', protect, authorize('staff', 'manager', 'owner'), getOrdersForKitchen);
router.patch('/:id/status', protect, authorize('staff', 'manager', 'owner'), updateOrderStatus);
router.patch('/:id/cancel', protect, authorize('manager', 'owner'), cancelOrder);

module.exports = router;
