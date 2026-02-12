# 🍽️ ABC Restaurant

Multi-Branch Restaurant Management & Ordering Platform

---

## 📌 Overview

**ABC Restaurant** is a full-featured restaurant management system designed for multi-branch operations.

It combines:

- 📊 Owner analytics dashboard  
- 📦 Centralized inventory management  
- 🧑‍🍳 Kitchen order workflow  
- 💳 POS & payment handling  
- 👥 Staff attendance tracking  
- 🛒 Customer ordering & tracking  
- 🔔 Approval & notification system  

The platform supports real-world restaurant operations with role-based access control and structured workflows.

---

## 🏗️ System Architecture

The system is divided into multiple modules:

- Owner Dashboard
- Inventory Management
- Branch Operations
- Kitchen Workflow
- Delivery Tracking
- Customer Ordering
- Notifications & Approvals
- Business Controls

---

## 👥 User Roles

### 🧑‍💼 Owner (Super Admin)

- View branch-wise revenue & profit
- Date-based analytics (Today / Monthly / Custom)
- Inventory oversight (IN & OUT records)
- Price approval workflow
- Staff directory with attendance & salary visibility
- Business controls (menu, coupons, feature toggles)
- Central notification center
- Branch configuration (table management toggle)

---

### 📦 Inventory Staff

- Add raw material (IN)
- Dispatch materials to branches (OUT)
- Edit prices (requires owner approval)
- View procurement history
- Track low stock
- Append-only immutable records

---

### 🧑‍💼 Branch Manager / Cashier

- Manage online & offline orders
- Update order status
- View branch inventory receipts
- Raise inventory requests (EOD)
- View staff attendance (read-only)

---

### 👨‍🍳 Kitchen & Staff Workers

- Selfie-based check-in & check-out
- View assigned tasks
- Manage order queue
- Request order completion
- View salary & bonus summary

---

### 🚚 Delivery Staff

- View assigned deliveries
- Update delivery status

---

### 🧡 Customer

- Browse menu & filter items
- Add items to cart
- Apply coupons
- Choose Dine-in / Takeaway / Delivery
- Track order in real time
- View order history
- Reorder past orders
- Manage profile & addresses
- Receive notifications (App / WhatsApp / SMS)

---

## 📦 Inventory System

### Raw Material IN (Procurement)
- Item name
- Quantity + Unit
- Cost per unit
- Total cost
- Date (calendar-based)

### Raw Material OUT (Dispatch to Branch)
- Item name
- Quantity + Unit
- Branch
- Cost
- Date

All records are immutable and date-filterable.

---

## 🔔 Notification System

Owner receives notifications for:

- Price change approvals
- Low stock alerts
- Inventory requests
- Salary pending alerts
- Kitchen order completion requests

Supports:
- In-app notifications
- WhatsApp notifications
- SMS notifications

---

## ⚙️ Business Controls

- Menu management (global / branch-level)
- Raw material master
- Unit master (kg, litre, pcs, etc.)
- Coupons & offers
- Feature toggles per branch
- Branch-level configuration (Table management enable/disable)

---

## 📊 Branch Insights

- Revenue trend charts
- Total orders
- Net profit
- Inventory usage
- Period-based filtering

Includes empty-state handling for no-data scenarios.

---

## 🛡️ Security & Workflow

- Role-based access control (RBAC)
- OTP verification for Owner login
- Approval-based inventory price changes
- Append-only audit-sensitive records

---

## 🚀 Future Enhancements

- Refund & cancellation processing
- Offline POS fallback
- Data export (Excel / CSV)
- Advanced profit & loss reports
- Loyalty & reward points system

---

## 📄 License

This project is currently for internal use and development.
License details can be added later.
