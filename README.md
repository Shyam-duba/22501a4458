# URL Shortener Service

A RESTful API service for creating and managing shortened URLs with statistics tracking.

## Features

- Create shortened URLs with custom names or auto-generated codes
- Set validity periods for URLs (1-365 days)
- Track click statistics and unique visitors
- Get detailed analytics for each shortened URL
- Automatic URL validation and expiration handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

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
**GET** `/api/urls/stats/:shortCode`

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
**GET** `/api/urls/:shortCode`

Redirects to the original URL and updates click statistics.

## Usage Examples

### Using cURL

1. **Create a shortened URL:**
```bash
curl -X POST http://localhost:3000/api/urls/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://www.google.com",
    "customName": "google",
    "validityDays": 60
  }'
```

2. **Get statistics:**
```bash
curl http://localhost:3000/api/urls/stats/google
```

3. **Access shortened URL:**
```bash
curl -L http://localhost:3000/api/urls/google
```

### Using JavaScript/Fetch

```javascript
// Create shortened URL
const createUrl = async () => {
  const response = await fetch('http://localhost:3000/api/urls/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalUrl: 'https://www.example.com',
      customName: 'example',
      validityDays: 30
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Get statistics
const getStats = async (shortCode) => {
  const response = await fetch(`http://localhost:3000/api/urls/stats/${shortCode}`);
  const data = await response.json();
  console.log(data);
};
```

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
