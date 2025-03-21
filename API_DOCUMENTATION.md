# Zoom Registration API Documentation

## Overview

This API provides endpoints to register participants for Zoom meetings and webinars. It's a microservice built with Node.js and TypeScript to simplify the registration process through a RESTful API.

## Base URL

```
http://localhost:3000
```

## Authentication

This API uses Zoom's Server-to-Server OAuth for authentication. Your Zoom credentials are configured in the `.env` file.

Required Zoom OAuth scopes:
- `meeting:read`
- `meeting:write`
- `webinar:read`
- `webinar:write`

## Endpoints

### Health Check

Check if the API is running properly.

```
GET /health
```

#### Response

```json
{
  "status": "OK",
  "message": "Zoom registration microservice is running",
  "timestamp": "2023-06-01T12:00:00.000Z"
}
```

### Register for a Meeting

Register a participant for a specific Zoom meeting.

```
POST /api/zoom/meetings/{meetingId}/register
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| meetingId | string | The Zoom meeting ID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Email address of the participant |
| first_name | string | Yes | First name of the participant |
| last_name | string | Yes | Last name of the participant |
| address | string | No | Address of the participant |
| city | string | No | City of the participant |
| country | string | No | Country of the participant |
| zip | string | No | Zip/postal code of the participant |
| state | string | No | State/province of the participant |
| phone | string | No | Phone number of the participant |
| industry | string | No | Industry of the participant |
| org | string | No | Organization of the participant |
| job_title | string | No | Job title of the participant |
| custom_questions | array | No | Custom questions and responses |

#### Request Example

```json
{
  "email": "participant@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St",
  "city": "San Francisco",
  "country": "US",
  "zip": "94105",
  "state": "CA",
  "phone": "5551234567",
  "industry": "Technology",
  "org": "Example Corp",
  "job_title": "Developer",
  "custom_questions": [
    {
      "title": "How did you hear about us?",
      "value": "Social Media"
    }
  ]
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "meeting_id": "123456789",
    "topic": "Example Meeting",
    "create_time": "2023-06-01T12:00:00Z",
    "status": "approved",
    "join_url": "https://zoom.us/j/123456789?pwd=abc123",
    "email": "participant@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Email, first name, and last name are required fields"
}
```

### Register for a Webinar

Register a participant for a specific Zoom webinar.

```
POST /api/zoom/webinars/{webinarId}/register
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| webinarId | string | The Zoom webinar ID |

#### Request Body

Same fields as the meeting registration endpoint.

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "webinar_id": "987654321",
    "topic": "Example Webinar",
    "create_time": "2023-06-01T12:00:00Z",
    "status": "approved",
    "join_url": "https://zoom.us/w/987654321?pwd=abc123",
    "email": "participant@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Batch Register for a Meeting

Register multiple participants at once for a specific Zoom meeting.

```
POST /api/zoom/meetings/{meetingId}/batch-register
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| meetingId | string | The Zoom meeting ID |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| registrants | array | Yes | List of participants to register |

Each registrant in the array should follow the same format as the single registration endpoint.

#### Request Example

```json
{
  "registrants": [
    {
      "email": "participant1@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    {
      "email": "participant2@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "org": "Acme Inc"
    },
    {
      "email": "participant3@example.com",
      "first_name": "Bob",
      "last_name": "Johnson",
      "country": "US",
      "state": "NY"
    }
  ]
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "registrants": [
      {
        "result": {
          "id": "abc123",
          "meeting_id": "123456789",
          "topic": "Example Meeting",
          "create_time": "2023-06-01T12:00:00Z",
          "status": "approved",
          "join_url": "https://zoom.us/j/123456789?pwd=abc123",
          "email": "participant1@example.com",
          "first_name": "John",
          "last_name": "Doe"
        },
        "email": "participant1@example.com"
      },
      {
        "result": {
          "id": "def456",
          "meeting_id": "123456789",
          "topic": "Example Meeting",
          "create_time": "2023-06-01T12:00:01Z",
          "status": "approved",
          "join_url": "https://zoom.us/j/123456789?pwd=def456",
          "email": "participant2@example.com",
          "first_name": "Jane",
          "last_name": "Smith"
        },
        "email": "participant2@example.com"
      },
      {
        "result": null,
        "error": "Invalid state code",
        "email": "participant3@example.com"
      }
    ],
    "successful_count": 2,
    "failed_count": 1
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Batch registration requires at least one registrant"
}
```

### Batch Register for a Webinar

Register multiple participants at once for a specific Zoom webinar.

```
POST /api/zoom/webinars/{webinarId}/batch-register
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| webinarId | string | The Zoom webinar ID |

#### Request Body

Same format as the batch meeting registration endpoint.

#### Success Response (200 OK)

Similar to the batch meeting registration response, but with webinar-specific data.

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (missing parameters, invalid format) |
| 401 | Unauthorized (invalid credentials) |
| 404 | Not Found (endpoint or resource not found) |
| 500 | Internal Server Error |

## Usage Examples

### cURL

#### Register for a Meeting

```bash
curl -X POST \
  http://localhost:3000/api/zoom/meetings/123456789/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "participant@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### Batch Register for a Meeting

```bash
curl -X POST \
  http://localhost:3000/api/zoom/meetings/123456789/batch-register \
  -H 'Content-Type: application/json' \
  -d '{
    "registrants": [
      {
        "email": "participant1@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      {
        "email": "participant2@example.com",
        "first_name": "Jane",
        "last_name": "Smith"
      }
    ]
  }'
```

### JavaScript (Fetch API)

```javascript
// Batch register for a meeting
fetch('http://localhost:3000/api/zoom/meetings/123456789/batch-register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    registrants: [
      {
        email: 'participant1@example.com',
        first_name: 'John',
        last_name: 'Doe'
      },
      {
        email: 'participant2@example.com',
        first_name: 'Jane',
        last_name: 'Smith'
      }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### PowerShell

```powershell
# Batch register for a meeting
$body = @{
    registrants = @(
        @{
            email = "participant1@example.com"
            first_name = "John"
            last_name = "Doe"
        },
        @{
            email = "participant2@example.com"
            first_name = "Jane"
            last_name = "Smith"
        }
    )
} | ConvertTo-Json

Invoke-WebRequest -Method POST `
  -Uri "http://localhost:3000/api/zoom/meetings/123456789/batch-register" `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body
```

## Setting Up the Service

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   PORT=3000
   NODE_ENV=development
   ZOOM_ACCOUNT_ID=your_zoom_account_id
   ZOOM_CLIENT_ID=your_zoom_client_id
   ZOOM_CLIENT_SECRET=your_zoom_client_secret
   ```

3. Start the service:
   ```bash
   npm run dev  # Development mode
   ```
   or
   ```bash
   npm run build  # Build for production
   npm start      # Run in production mode
   ```

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Make sure your Zoom credentials in `.env` are correct and have the required scopes.

2. **Meeting/Webinar Not Found**: Verify the meeting or webinar ID is correct and exists in your Zoom account.

3. **Registration Failed**: Ensure all required fields (email, first_name, last_name) are provided.

4. **Server Connection Error**: Verify the server is running on the expected port and there are no firewall issues.

5. **Batch Registration Errors**: When using batch registration, check the response for details on which registrations succeeded and which failed. 