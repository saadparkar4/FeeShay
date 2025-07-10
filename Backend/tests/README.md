# FeeShay Backend API Tests

This directory contains comprehensive tests for all FeeShay backend API endpoints.

## Test Structure

### `api-endpoints.test.js`

Comprehensive test suite covering all API endpoints with real examples for each controller and route.

## Test Coverage

### 🔐 Authentication Endpoints (`/api/v1/auth`)

-   **POST /register** - User registration (client/freelancer)
-   **POST /login** - User authentication
-   **GET /profile** - Get user profile
-   **PUT /profile** - Update user profile
-   **PUT /change-password** - Change user password

### 💼 Jobs Endpoints (`/api/v1/jobs`)

-   **GET /** - Get all jobs with pagination and filtering
-   **GET /categories** - Get job categories
-   **GET /:id** - Get specific job by ID
-   **POST /** - Create new job (client only)
-   **PUT /:id** - Update job (owner only)
-   **DELETE /:id** - Delete job (owner only)
-   **GET /my/jobs** - Get user's own jobs (client only)

### 🛠️ Services Endpoints (`/api/v1/services`)

-   **GET /** - Get all services with pagination and filtering
-   **GET /:id** - Get specific service by ID
-   **POST /** - Create new service (freelancer only)
-   **PUT /:id** - Update service (owner only)
-   **DELETE /:id** - Delete service (owner only)
-   **GET /my/services** - Get user's own services (freelancer only)

### 📝 Proposals Endpoints (`/api/v1/proposals`)

-   **GET /** - Get all proposals with pagination
-   **GET /:id** - Get specific proposal by ID
-   **POST /** - Create new proposal (freelancer only)
-   **PUT /:id** - Update proposal (owner only)
-   **DELETE /:id** - Delete proposal (owner only)
-   **GET /my/proposals** - Get user's own proposals (freelancer only)
-   **GET /job/:jobId** - Get proposals for specific job (client only)
-   **PUT /:id/status** - Update proposal status (client only)

### 💬 Messages Endpoints (`/api/v1/messages`)

-   **POST /chats** - Create new chat
-   **GET /chats** - Get user's chats
-   **GET /chats/:chatId/messages** - Get messages in chat
-   **POST /chats/:chatId/messages** - Send message in chat
-   **PUT /chats/:chatId/read** - Mark messages as read
-   **GET /unread-count** - Get unread message count
-   **DELETE /messages/:messageId** - Delete message

### ⭐ Reviews Endpoints (`/api/v1/reviews`)

-   **GET /** - Get all reviews with pagination
-   **GET /:id** - Get specific review by ID
-   **GET /user/:userId** - Get reviews for specific user
-   **POST /** - Create new review
-   **PUT /:id** - Update review (owner only)
-   **DELETE /:id** - Delete review (owner only)

## Test Data Examples

### User Registration

```javascript
{
    email: 'client@test.com',
    password: 'password123',
    role: 'client',
    name: 'Test Client'
}
```

### Job Creation

```javascript
{
    title: 'Web Development Project',
    description: 'Need a full-stack web application built with React and Node.js',
    category: 'Tech',
    budget_min: 1000,
    budget_max: 5000,
    deadline: '2024-12-31',
    skills_required: ['React', 'Node.js', 'MongoDB']
}
```

### Service Creation

```javascript
{
    title: 'Professional Web Development',
    description: 'Full-stack web development services with modern technologies',
    category: 'Tech',
    price: 2500,
    delivery_time_days: 14,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript']
}
```

### Proposal Creation

```javascript
{
    cover_letter: 'I have extensive experience in web development and would love to work on this project.',
    bid_amount: 3000,
    delivery_time_days: 10,
    milestones: [
        {
            title: 'Design Phase',
            description: 'Create wireframes and mockups',
            amount: 1000,
            due_date: '2024-11-15'
        }
    ]
}
```

### Review Creation

```javascript
{
    rating: 5,
    comment: 'Excellent work! Very professional and delivered on time.',
    service_quality: 5,
    communication: 5,
    value_for_money: 5
}
```

## Running Tests

### Prerequisites

1. MongoDB running locally or set `MONGODB_URI_TEST` environment variable
2. Install dependencies: `npm install`

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only API endpoint tests
npm run test:api

# Run tests with coverage report
npm run test:coverage
```

### Environment Variables

```bash
# Test database URI (defaults to localhost)
MONGODB_URI_TEST=mongodb://localhost:27017/feeshay_test

# JWT secret for tests
JWT_SECRET=test-secret-key
```

## Test Features

### ✅ Authentication Testing

-   User registration (client/freelancer)
-   Login/logout functionality
-   JWT token validation
-   Role-based access control

### ✅ CRUD Operations

-   Create, Read, Update, Delete for all entities
-   Proper error handling for invalid operations
-   Authorization checks for protected routes

### ✅ Data Validation

-   Input validation using Joi schemas
-   MongoDB ObjectId validation
-   Required field validation
-   Data type validation

### ✅ Pagination & Filtering

-   Paginated responses for list endpoints
-   Search functionality
-   Category filtering
-   Status filtering

### ✅ Error Handling

-   Invalid MongoDB ObjectId handling
-   Non-existent resource handling
-   Validation error responses
-   Authentication error responses

### ✅ Authorization

-   Role-based access control (client/freelancer)
-   Resource ownership validation
-   Protected route testing

## Test Output

The tests provide detailed output including:

-   ✅ Pass/fail status for each test
-   📊 Coverage reports
-   ⏱️ Test execution time
-   🔍 Detailed error messages for failures

## Example Test Output

```
PASS tests/api-endpoints.test.js
  FeeShay API Endpoints
    Health Check
      ✓ should return health status (5ms)
    Authentication Endpoints
      POST /api/v1/auth/register
        ✓ should register a new client (245ms)
        ✓ should register a new freelancer (156ms)
        ✓ should reject registration with invalid data (12ms)
      POST /api/v1/auth/login
        ✓ should login with valid credentials (89ms)
        ✓ should reject login with invalid credentials (23ms)
    Jobs Endpoints
      GET /api/v1/jobs
        ✓ should get all jobs with pagination (45ms)
        ✓ should filter jobs by category (34ms)
        ✓ should search jobs by title (23ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        8.234s
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

    - Ensure MongoDB is running
    - Check `MONGODB_URI_TEST` environment variable

2. **JWT Secret Error**

    - Set `JWT_SECRET` environment variable for tests

3. **Port Already in Use**

    - Tests use a separate test database
    - Ensure no conflicts with development server

4. **Timeout Errors**
    - Tests have 30-second timeout
    - Increase timeout in `jest.config.js` if needed

### Debug Mode

Run tests with verbose output:

```bash
npm test -- --verbose
```

### Individual Test Files

Run specific test files:

```bash
npm test -- tests/api-endpoints.test.js
```
