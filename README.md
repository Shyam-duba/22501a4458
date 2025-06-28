# URL Shortener Service

A RESTful API service for creating and managing shortened URLs with statistics tracking.

## Features

- Create shortened URLs with custom names or auto-generated codes
- Set validity periods for URLs (1-365 days)
- Track click statistics and unique visitors
- Get detailed analytics for each shortened URL
- Automatic URL validation and expiration handling

## Prerequisites

- Node.js 
- MongoDB 
- npm 

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system or update the connection string in `index.js`

3. Start the server:
```bash
npm start
```

The server will start on port 3000 by default.

## API Endpoints

### 1. Create Shortened URL
**POST** `/api/urls/shorten`

Creates a new shortened URL with optional custom name and validity period.

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "shortcode": "my-custom-link",  // Optional
  "validity": 30               // Optional, default: 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shortUrl": "http://localhost:3000/api/urls/my-custom-link",
    "validity": "2024-02-15T10:30:00.000Z",
  }
}
```

### 2. Get URL Statistics
**GET** `/shorturls/:shortCode`

Retrieves detailed statistics for a shortened URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "my-custom-link",
    "customName": "my-custom-link",
    "shortUrl": "http://localhost:3000/api/urls/my-custom-link",
    "validity": "2024-02-15T10:30:00.000Z",
    "isExpired": false,
    "timeRemaining": "25 days",
    "clicks": 42,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastAccessed": "2024-01-20T15:45:00.000Z",
    "uniqueVisitors": 15,
    "isActive": true
  }
}
```

### 3. Access Shortened URL
**GET** `/:shortCode`

Redirects to the original URL and updates click statistics.

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (invalid URL, invalid parameters)
- `404` - URL not found
- `409` - Custom name already exists
- `410` - URL expired or inactive
- `500` - Internal server error

## Database Schema

The URL model includes:
- `originalUrl` - The original long URL
- `shortCode` - Unique identifier for the shortened URL
- `customName` - Optional custom name provided by user
- `validity` - Expiration date
- `clicks` - Number of times the URL was accessed
- `createdAt` - Creation timestamp
- `lastAccessed` - Last access timestamp
- `userAgent` - Array of user agents
- `ipAddresses` - Array of unique visitor IPs
- `isActive` - Whether the URL is active

## DEMO


![Screenshot 2025-06-28 114009](https://github.com/user-attachments/assets/9e6ed716-0157-4393-9160-689f05281a19)
![Screenshot 2025-06-28 113854](https://github.com/user-attachments/assets/2169f283-7031-49a5-8cc2-869336e1768e)
![Screenshot 2025-06-28 113843](https://github.com/user-attachments/assets/d6b4958a-8823-4774-9bd3-fb53264ce03e)
