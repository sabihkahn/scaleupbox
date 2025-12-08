# ScaleUpBox

A full-stack web application for project management with authentication and cloud storage capabilities. This project features a modern React frontend with Vite, an Express backend with MongoDB, and integrates Google OAuth for seamless authentication.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

**ScaleUpBox** is a comprehensive project management platform that enables users to:

- **Authenticate** securely using email/password or Google OAuth
- **Manage projects** in both monolithic and microservice architectures
- **Handle user profiles** with image uploads to Cloudinary
- **Access protected routes** with JWT token-based authorization
- **Experience rate limiting** for API security

The application is built as a client-server architecture with separate frontend (React) and backend (Node.js) implementations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17 + Tailwind Merge
- **UI Components**: shadcn UI (Label, Separator, Slot)
- **Icons**: Lucide React 0.555.0
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios 1.13.2
- **Authentication**: Google OAuth (@react-oauth/google)
- **Image Upload**: Cloudinary
- **Notifications**: React Toastify 11.0.5
- **Linting**: ESLint 9.39.1

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 9.0.0
- **Caching**: Redis with ioredis 5.8.2
- **Authentication**: JWT (jsonwebtoken 9.0.2) + Google Auth Library
- **Password Hashing**: bcryptjs 3.0.3
- **CORS**: Enabled for cross-origin requests
- **Environment**: Dotenv 17.2.3
- **Development**: Nodemon 3.1.11

## 🏗️ Architecture

```
ScaleUpBox (Full-Stack Application)
│
├── Frontend (React + Vite)
│   └── Communicates via REST API
│
└── Backend (Express + Node.js)
    ├── Authentication Service (Google OAuth + JWT)
    ├── Database (MongoDB via Mongoose)
    ├── Cache Layer (Redis)
    └── Rate Limiting Middleware
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas connection
- **Redis**: Local instance (for caching)
- **Git**: For version control

### Required Accounts
- **Google Cloud**: For OAuth credentials
- **Cloudinary**: For image uploads

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/sabihkahn/scaleupbox.git
cd scaleupbox
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/scaleupbox
# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scaleupbox

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_BASE_URL=http://localhost:4000

# Google OAuth
VITE_CLIENT_ID=your_google_client_id
VITE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🎮 Running the Application

### Development Mode

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:4000`

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Build

#### Frontend Build

```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

### Backend Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection configuration
│   └── redis.js              # Redis connection setup
├── controller/
│   └── authcontroller.js     # Authentication logic (Google OAuth, Login, Signup)
├── middleware/
│   ├── ratelimiting.js       # Rate limiting middleware
│   └── googleResponse/
│       └── verifygetpayload.js  # Google token verification
├── models/
│   ├── authmodel.js          # User schema
│   ├── apischema.js          # API schema definitions
│   ├── microserviceproject/
│   │   └── microservicemodel.js  # Microservice project schema
│   └── monolothicproject/
│       └── projectmodel.js   # Monolithic project schema
├── Routes/
│   └── AuthRoutes/
│       └── authroute.js      # Authentication endpoints
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
└── server.js                # Express server setup
```

### Frontend Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── cloudinary/
│   │   └── Cloudinary.jsx  # Cloudinary image upload component
│   ├── components/
│   │   ├── BearWithEyes.jsx # Custom component
│   │   ├── login-form.jsx   # Login form component
│   │   ├── signup-form.jsx  # Signup form component
│   │   └── ui/              # Reusable UI components
│   │       ├── button.jsx
│   │       ├── field.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       └── separator.jsx
│   ├── lib/
│   │   └── utils.js        # Utility functions
│   ├── pages/
│   │   ├── Auth.jsx        # Signup page
│   │   ├── AuthLogin.jsx   # Login page
│   │   └── Dashboard.jsx   # Protected dashboard page
│   ├── security/
│   │   └── protectedroutes.jsx  # Route protection wrapper
│   ├── App.jsx             # Main App component with routing
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry point
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── jsconfig.json          # JavaScript configuration
├── package.json           # Dependencies & scripts
├── vite.config.js         # Vite configuration
└── index.html             # HTML entry point
```

## ✨ Features

### Authentication
- ✅ **Google OAuth Integration**: Sign up/login with Google
- ✅ **Email/Password Authentication**: Traditional authentication method
- ✅ **JWT Tokens**: Secure token-based authorization
- ✅ **Refresh Tokens**: Extended session management with 7-day refresh tokens
- ✅ **Password Hashing**: bcryptjs encryption for security

### Project Management
- ✅ **Monolithic Projects**: Traditional single-codebase projects
- ✅ **Microservice Projects**: Distributed service-based projects
- ✅ **Project CRUD Operations**: Create, read, update, delete projects

### Security Features
- ✅ **Rate Limiting**: 5 requests per 30 seconds per IP
- ✅ **CORS Protection**: Configured for localhost:5173
- ✅ **Protected Routes**: Dashboard and protected endpoints
- ✅ **Token-based Authorization**: JWT validation

### Image Management
- ✅ **Cloudinary Integration**: Cloud-based image storage
- ✅ **User Profile Pictures**: Upload and manage profile images

### Caching
- ✅ **Redis Integration**: Caching layer for performance
- ✅ **Session Management**: Redis-backed sessions

## 📡 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login with credentials |
| POST | `/auth/google` | Google OAuth callback |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh` | Refresh access token |

## 🔐 Environment Variables

### Backend Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/scaleupbox |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Required |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Required |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Required |

### Frontend Variables

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Backend API base URL |
| `VITE_CLIENT_ID` | Google OAuth client ID |
| `VITE_CLIENT_SECRET` | Google OAuth client secret |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset |

## 📦 Available Scripts

### Backend

```bash
npm run dev      # Start development server with Nodemon
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check MongoDB Atlas credentials if using cloud database

### Redis Connection Issues
- Ensure Redis is running: `redis-server`
- Verify Redis URL in `.env`

### CORS Errors
- Check that frontend URL is in backend CORS configuration
- Ensure credentials are set to `true` in CORS options

### Google OAuth Issues
- Verify Google Client ID and Secret
- Ensure redirect URIs are configured in Google Cloud Console
- Check that credentials are in correct environment variables

## 👤 Author

**Sabih Khan** - Initial development and architecture

## 📄 License

This project is licensed under the ISC License - see `LICENSE` file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Last Updated**: December 2025  
**Current Version**: 1.0.0
