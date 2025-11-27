# StreakUp

A habit-tracking mobile application built with React Native (Expo) and Node.js to help users build and maintain daily, weekly, and monthly habits with streak tracking.

## Features

- User authentication with JWT
- Create and manage habits with different frequencies (daily, weekly, monthly)
- Track habit completion streaks
- Swipeable habit cards for quick actions
- Secure credential storage
- RESTful API backend

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Mobile
- React Native with Expo
- TypeScript
- Expo Router for navigation
- React Native Paper for UI components
- Axios for API calls
- Expo Secure Store for credential management

## Project Structure

```
StreakUp/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth and error handling
│   │   ├── utils/          # Helper functions
│   │   └── index.js        # Server entry point
│   └── package.json
│
└── mobile/
    ├── src/
    │   ├── app/            # Expo Router pages
    │   ├── components/     # Reusable components
    │   ├── lib/            # API and context
    │   ├── types/          # TypeScript definitions
    │   └── utils/          # Utility functions
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API base URL in `src/lib/api/axios.ts` to point to your backend server

   **Tip:** If running the backend on localhost, use your machine's private IP address instead of `localhost` or `127.0.0.1` when testing on a physical device. You can find your private IP by running:
   - On Linux/Mac: `ifconfig` or `ip addr show`
   - On Windows: `ipconfig`
   
   Example: `http://192.168.1.100:5000` instead of `http://localhost:5000`

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/validate` - Validate token

### Habits
- `POST /habit/add-habit` - Create new habit
- `GET /habit/get-habits` - Get user's habits
- `DELETE /habit/delete-habit/:id` - Delete habit
- `PATCH /habit/complete-habit/:id` - Mark habit as completed

## Development Status

Currently under active development.

