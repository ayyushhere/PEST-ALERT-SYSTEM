# AgriShield - Pest Alert System

AgriShield is a real-time pest alert system designed to help farmers report pest infestations and allow administrators to broadcast alerts to all users.

## 🚀 Key Features

*   **Farmer Reporting**: Submit pest reports with images and location data.
*   **Admin Dashboard**: View, manage, and update report statuses.
*   **Real-time Alerts**: Instant broadcasting of pest threats to farmers via Socket.IO.
*   **Image Uploads**: Secure image handling for pest verification.
*   **Geolocation**: Accurate location tracking for reports.

## 🛠️ Technology Stack

*   **Frontend**: React 19 + Vite + TailwindCSS
*   **Backend**: Node.js + Express 5
*   **Database**: MongoDB + Mongoose
*   **Real-time**: Socket.IO 4
*   **File Handling**: Multer

## 📂 Directory Structure

```
pest-alert-system/
├── client/                     # React Frontend
├── server/                     # Node.js Backend
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   └── uploads/                # Image storage
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js installed
*   MongoDB installed and running locally or a MongoDB Atlas URI

### 1. Server Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
# Note: You may need to install multer separately if not in package.json
npm install multer
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pest-alert-system
```

Start the server:
```bash
npm run dev
```

### 2. Client Setup

Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🔌 API Endpoints

### Reports
*   `POST /api/reports` - Submit a new pest report (FormData: `image`, `farmerName`, `location`, `pestType`, `description`)
*   `GET /api/reports` - Get all reports (Admin)
*   `GET /api/reports/:id` - Get a single report
*   `PUT /api/reports/:id` - Update report status (`Pending`, `Resolved`, `Rejected`)

### Alerts
*   `POST /api/reports/broadcast` - Broadcast an alert for a specific report
