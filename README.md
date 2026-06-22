# ZipLink | Premium URL Shortener

ZipLink is a complete, production-ready, full-stack URL Shortener web application built using the MERN stack (MongoDB, Express, React, Node.js) and Vite. It provides modern glassmorphic styling, high performance, robust security, and detailed click analytics.

## Features

- **⚡ Fast URL Shortening**: Paste any long link to instantly get a short Base62 encoded URL.
- **📈 Real-Time Click Analytics**: View total clicks, created date, and target destination for shortened links.
- **🛡️ Secure Design**: Integrated with CORS, Helmet headers, rate limiting protection, and URL validator logic.
- **💾 Database Reliability**: MongoDB integration via Mongoose, with a graceful, fully functional in-memory fallback if the database server is offline.
- **🎨 Premium UX/UI**: responsive dark-mode styled layout utilizing glassmorphic surfaces, custom gradients, and interactive animations.

---

## Repository Structure

```
url-shortener/
 ├── backend/
 │    ├── src/
 │    │    ├── config/           # Database setup
 │    │    ├── controllers/      # Route handler operations
 │    │    ├── middleware/       # Rate limiting & security
 │    │    ├── models/           # Mongoose schemas
 │    │    ├── routes/           # Express API endpoints
 │    │    ├── utils/            # Base62 & uniqueness checks
 │    │    ├── app.js            # Express app assembly
 │    │    └── server.js         # Entry server file
 │    ├── .env.example
 │    └── package.json
 ├── frontend/
 │    ├── src/
 │    │    ├── api/              # Axios request setup
 │    │    ├── components/       # UI elements (Form, Results, Analytics)
 │    │    ├── App.jsx           # Main orchestrator
 │    │    ├── index.css         # Styling system
 │    │    └── main.jsx          # React DOM entry
 │    ├── index.html
 │    └── package.json
 ├── package.json                # Root concurrently dev launcher
 └── README.md
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (Optional, has in-memory fallback for testing)

### Step 1: Install Dependencies
From the root directory, run:
```bash
npm run install:all
```
This will automatically install packages for the root runner, the backend server, and the frontend client.

### Step 2: Environment Variables
Create a `.env` file in the `backend/` directory (you can copy the provided `.env.example` file).

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/url_shortener
BASE_URL=http://localhost:5000
```

- `PORT`: The port the backend server listens on.
- `MONGO_URI`: Connection string for MongoDB.
- `BASE_URL`: Base address of your shortened URLs (typically pointing to the backend redirect handler).

---

## Running the Application

### Development Mode
To start both the Node backend and React frontend concurrently:
```bash
npm run dev
```

- **Frontend client** runs on: `http://localhost:5173`
- **Backend API server** runs on: `http://localhost:5000`

### Production Mode
To launch the servers together:
```bash
npm start
```

---

## API Endpoints

### 1. Shorten URL
- **Endpoint**: `POST /api/url/shorten`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "url": "https://example.com/very-long-page"
  }
  ```
- **Response**:
  ```json
  {
    "shortUrl": "http://localhost:5000/abc123",
    "shortCode": "abc123"
  }
  ```

### 2. Get Analytics
- **Endpoint**: `GET /api/url/:shortCode`
- **Response**:
  ```json
  {
    "originalUrl": "https://example.com/very-long-page",
    "shortCode": "abc123",
    "clicks": 14,
    "createdAt": "2026-06-22T00:00:00.000Z"
  }
  ```

### 3. Redirect Short Link
- **Endpoint**: `GET /:shortCode`
- **Behavior**: Increments the click count in the database and redirects the browser to the original URL.
