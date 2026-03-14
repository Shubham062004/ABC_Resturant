import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import MyOrders from './pages/MyOrders';
import CustomerOrderDetails from './pages/CustomerOrderDetails';
import Kitchen from './pages/Kitchen';
import AdminOrderDetails from './pages/AdminOrderDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Facing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<CustomerOrderDetails />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        {/* Management & Staff Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-admin/:id" element={<AdminOrderDetails />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/staff" element={<Staff />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


