# Zoom Registration Microservice

A Node.js TypeScript microservice for handling API requests to register participants for Zoom meetings and webinars.

## Features

- Register participants for Zoom meetings
- Register participants for Zoom webinars
- Batch registration of multiple participants
- Environment-based configuration
- TypeScript for type safety
- Express.js for API handling
- Interactive Swagger documentation
- Comprehensive API documentation

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Zoom API credentials (Account ID, Client ID, Client Secret)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/micro-zoom.git
   cd micro-zoom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory based on the provided example:
   ```
   PORT=3000
   NODE_ENV=development
   ZOOM_ACCOUNT_ID=your_zoom_account_id
   ZOOM_CLIENT_ID=your_zoom_client_id
   ZOOM_CLIENT_SECRET=your_zoom_client_secret
   JWT_SECRET=your_jwt_secret
   ```

4. Build the application:
   ```bash
   npm run build
   ```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

### Interactive Swagger Documentation

When the server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

This provides a user-friendly interface to:
- Explore available endpoints
- View request/response schemas
- Test API calls directly from the browser

### Detailed Documentation

For more comprehensive documentation, see:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- Swagger UI endpoint at `/api-docs`

## Required Zoom API Scopes

When creating your Server-to-Server OAuth application in the Zoom Marketplace, make sure to select these scopes:
- `meeting:read` - For reading meeting details
- `meeting:write` - For registering participants to meetings
- `webinar:read` - For reading webinar details
- `webinar:write` - For registering participants to webinars

## Available Endpoints

### Health Check

```
GET /health
```

### Single Registration

```
POST /api/zoom/meetings/:meetingId/register
POST /api/zoom/webinars/:webinarId/register
```

### Batch Registration

```
POST /api/zoom/meetings/:meetingId/batch-register
POST /api/zoom/webinars/:webinarId/batch-register
```

## Example Requests

### Register a Single Participant

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
  "job_title": "Developer"
}
```

### Register Multiple Participants (Batch)

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
      "last_name": "Smith"
    }
  ]
}
```

## Response Examples

### Success Response

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

### Batch Response

```json
{
  "success": true,
  "data": {
    "registrants": [
      {
        "result": { /* registration data */ },
        "email": "participant1@example.com"
      },
      {
        "result": null,
        "error": "Invalid email format",
        "email": "participant2@example.com"
      }
    ],
    "successful_count": 1,
    "failed_count": 1
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

### Project Structure

```
micro-zoom/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── interfaces/    # TypeScript interfaces
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── index.ts       # Entry point
├── API_DOCUMENTATION.md  # Detailed API docs
├── dist/              # Compiled JavaScript
├── .env               # Environment variables
├── package.json       # Project metadata
├── tsconfig.json      # TypeScript config
└── README.md          # Documentation
```

## License

[MIT](LICENSE)

## Testing

This project includes comprehensive unit and integration tests to ensure reliability of the API. The test suite is built with Jest and tests the following components:

- **Service Tests**: Tests for the Zoom service methods that interact with the Zoom API
- **Controller Tests**: Tests for the controller layer that handles HTTP requests and responses
- **Route Tests**: Integration tests for the API endpoints
- **Authentication Tests**: Tests for the token generation and authentication process

### Running Tests

To run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

### GitHub Actions

This project uses GitHub Actions to automatically run tests on push to main branch and on pull requests. The workflow configuration is in `.github/workflows/tests.yml`.

## Deployment

// ... existing code ... 