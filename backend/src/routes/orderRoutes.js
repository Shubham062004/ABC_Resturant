const express = require('express');
const router = express.Router();
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

// Customer routes
router.post('/', protect, createOrder);
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
