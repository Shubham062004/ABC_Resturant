# 🍽️ ABC Restaurant Management Platform

A high-performance, full-stack Multi-Branch Restaurant Management and Ordering Platform. Designed to streamline operations, from kitchen workflows to customer ordering and owner analytics.

---

## 🚀 Key Features

### 🏢 Multi-Branch Management
- **Branch Control**: Toggle features like table management per branch.
- **Role-Based Access**: Secure access control for Owners, Managers, Kitchen Staff, and Customers.
- **Menu Management**: Centralized control over global and branch-specific menus.

### 📦 Operational Excellence
- **Inventory Management**: Real-time tracking of raw materials with approval-based price changes.
- **Kitchen Workflow**: Optimized ordering and preparation status tracking.
- **POS & Payments**: Integrated point-of-sale systems for seamless checkout.
- **Staff Tracking**: Detailed attendance and performance monitoring.

### 📊 Advanced Analytics
- **Live Dashboards**: Period-based filtering for revenue, total orders, and net profit.
- **Visual Insights**: Interactive charts for revenue trends and inventory usage.

### 🛡️ Security & Integrity
- **Authentication**: JWT-based security with OTP verification for sensitive roles (Twilio integrated).
- **Audit Logs**: Append-only records for sensitive financial and inventory data.
- **Validation**: Strict request validation using `express-validator`.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT & BcryptJS
- **Communication**: Twilio (OTP Services)

---

## 📂 Project Structure

```bash
ABC_Resturant/
├── backend/                # Express Server
│   ├── src/
│   │   ├── config/         # Database & App configurations
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & Error handling
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # External integrations (Twilio, etc.)
│   │   └── utils/          # Helper functions
│   └── server.js           # Entry point
├── frontend/               # React Web App
│   ├── src/
│   │   ├── components/     # UI Building blocks
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page wrappers
│   │   ├── pages/          # Full page views
│   │   ├── services/       # API call definitions
│   │   ├── store/          # Zustand state stores
│   │   └── main.jsx        # App entry point
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Twilio Account (for OTP features)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure:
   ```env
   PORT=5002
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   # Twilio Credentials
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=your_number
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5002/api
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is currently for internal use and development. Built with ❤️ for the ABC Restaurant Group.

