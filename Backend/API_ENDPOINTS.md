# FeeShay Backend API Endpoints Reference

This document provides a comprehensive reference for all FeeShay backend API endpoints with examples.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

### POST /auth/register

Register a new user (client or freelancer)

**Request:**

```json
{
    "email": "user@example.com",
    "password": "password123",
    "role": "client",
    "name": "John Doe"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "token": "jwt_token_here",
        "user": {
            "_id": "user_id",
            "email": "user@example.com",
            "role": "client",
            "name": "John Doe"
        }
    }
}
```

### POST /auth/login

Authenticate user and get token

**Request:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "token": "jwt_token_here",
        "user": {
            "_id": "user_id",
            "email": "user@example.com",
            "role": "client"
        }
    }
}
```

### GET /auth/profile

Get user profile (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
    "success": true,
    "data": {
        "user": {
            "_id": "user_id",
            "email": "user@example.com",
            "role": "client"
        },
        "profile": {
            "name": "John Doe",
            "bio": "Professional developer",
            "location": "New York",
            "phone": "+1234567890"
        }
    }
}
```

### PUT /auth/profile

Update user profile (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "name": "Updated Name",
    "bio": "Updated bio",
    "location": "Los Angeles",
    "phone": "+1987654321"
}
```

### PUT /auth/change-password

Change user password (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
}
```

## Jobs

### GET /jobs

Get all jobs with pagination and filtering

**Query Parameters:**

-   `page` (number): Page number (default: 1)
-   `limit` (number): Items per page (default: 10)
-   `category` (string): Filter by category
-   `search` (string): Search in title and description
-   `minBudget` (number): Minimum budget
-   `maxBudget` (number): Maximum budget

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "job_id",
                "title": "Web Development Project",
                "description": "Need a full-stack web application",
                "category": "Tech",
                "budget_min": 1000,
                "budget_max": 5000,
                "client": {
                    "_id": "client_id",
                    "name": "Client Name"
                },
                "status": "active",
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 50,
        "page": 1,
        "limit": 10
    }
}
```

### GET /jobs/categories

Get all job categories

**Response:**

```json
{
    "success": true,
    "data": ["Tech", "Design", "Writing", "Marketing", "Photography"]
}
```

### GET /jobs/:id

Get specific job by ID

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "job_id",
        "title": "Web Development Project",
        "description": "Need a full-stack web application",
        "category": "Tech",
        "budget_min": 1000,
        "budget_max": 5000,
        "deadline": "2024-12-31",
        "skills_required": ["React", "Node.js"],
        "client": {
            "_id": "client_id",
            "name": "Client Name",
            "profile_image_url": "https://example.com/avatar.jpg"
        },
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

### POST /jobs

Create new job (client only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "title": "Web Development Project",
    "description": "Need a full-stack web application built with React and Node.js",
    "category": "Tech",
    "budget_min": 1000,
    "budget_max": 5000,
    "deadline": "2024-12-31",
    "skills_required": ["React", "Node.js", "MongoDB"]
}
```

### PUT /jobs/:id

Update job (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "title": "Updated Web Development Project",
    "description": "Updated description",
    "budget_max": 6000
}
```

### DELETE /jobs/:id

Delete job (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

### GET /jobs/my/jobs

Get user's own jobs (client only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

## Services

### GET /services

Get all services with pagination and filtering

**Query Parameters:**

-   `page` (number): Page number
-   `limit` (number): Items per page
-   `category` (string): Filter by category
-   `search` (string): Search in title and description
-   `minPrice` (number): Minimum price
-   `maxPrice` (number): Maximum price

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "service_id",
                "title": "Professional Web Development",
                "description": "Full-stack web development services",
                "category": "Tech",
                "price": 2500,
                "delivery_time_days": 14,
                "freelancer": {
                    "_id": "freelancer_id",
                    "name": "Freelancer Name",
                    "rating": 4.8
                },
                "status": "active",
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 30,
        "page": 1,
        "limit": 10
    }
}
```

### GET /services/:id

Get specific service by ID

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "service_id",
        "title": "Professional Web Development",
        "description": "Full-stack web development services",
        "category": "Tech",
        "price": 2500,
        "delivery_time_days": 14,
        "skills": ["React", "Node.js", "MongoDB"],
        "freelancer": {
            "_id": "freelancer_id",
            "name": "Freelancer Name",
            "rating": 4.8,
            "profile_image_url": "https://example.com/avatar.jpg"
        },
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

### POST /services

Create new service (freelancer only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "title": "Professional Web Development",
    "description": "Full-stack web development services with modern technologies",
    "category": "Tech",
    "price": 2500,
    "delivery_time_days": 14,
    "skills": ["React", "Node.js", "MongoDB", "TypeScript"]
}
```

### PUT /services/:id

Update service (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "title": "Updated Professional Web Development",
    "price": 3000,
    "delivery_time_days": 10
}
```

### DELETE /services/:id

Delete service (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

### GET /services/my/services

Get user's own services (freelancer only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

## Proposals

### GET /proposals

Get all proposals with pagination

**Query Parameters:**

-   `page` (number): Page number
-   `limit` (number): Items per page
-   `status` (string): Filter by status (pending, accepted, rejected)

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "proposal_id",
                "cover_letter": "I have extensive experience in web development",
                "bid_amount": 3000,
                "delivery_time_days": 10,
                "status": "pending",
                "job": {
                    "_id": "job_id",
                    "title": "Web Development Project"
                },
                "freelancer": {
                    "_id": "freelancer_id",
                    "name": "Freelancer Name"
                },
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 20,
        "page": 1,
        "limit": 10
    }
}
```

### GET /proposals/:id

Get specific proposal by ID

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "proposal_id",
        "cover_letter": "I have extensive experience in web development",
        "bid_amount": 3000,
        "delivery_time_days": 10,
        "status": "pending",
        "milestones": [
            {
                "title": "Design Phase",
                "description": "Create wireframes and mockups",
                "amount": 1000,
                "due_date": "2024-11-15"
            }
        ],
        "job": {
            "_id": "job_id",
            "title": "Web Development Project"
        },
        "freelancer": {
            "_id": "freelancer_id",
            "name": "Freelancer Name"
        },
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

### POST /proposals

Create new proposal (freelancer only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "cover_letter": "I have extensive experience in web development and would love to work on this project.",
    "bid_amount": 3000,
    "delivery_time_days": 10,
    "job": "job_id",
    "service": "service_id",
    "milestones": [
        {
            "title": "Design Phase",
            "description": "Create wireframes and mockups",
            "amount": 1000,
            "due_date": "2024-11-15"
        },
        {
            "title": "Development Phase",
            "description": "Build the application",
            "amount": 1500,
            "due_date": "2024-11-30"
        }
    ]
}
```

### PUT /proposals/:id

Update proposal (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "cover_letter": "Updated cover letter",
    "bid_amount": 3500,
    "delivery_time_days": 8
}
```

### DELETE /proposals/:id

Delete proposal (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

### GET /proposals/my/proposals

Get user's own proposals (freelancer only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

### GET /proposals/job/:jobId

Get proposals for specific job (client only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

### PUT /proposals/:id/status

Update proposal status (client only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "status": "accepted"
}
```

## Messages

### POST /messages/chats

Create new chat (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "userId": "other_user_id"
}
```

### GET /messages/chats

Get user's chats (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "chat_id",
                "participants": [
                    {
                        "_id": "user1_id",
                        "name": "User 1"
                    },
                    {
                        "_id": "user2_id",
                        "name": "User 2"
                    }
                ],
                "last_message": {
                    "content": "Hello!",
                    "created_at": "2024-01-01T00:00:00.000Z"
                },
                "unread_count": 2
            }
        ],
        "total": 5,
        "page": 1,
        "limit": 10
    }
}
```

### GET /messages/chats/:chatId/messages

Get messages in chat (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "message_id",
                "content": "Hello! I'm interested in your project.",
                "sender": {
                    "_id": "sender_id",
                    "name": "Sender Name"
                },
                "is_read": false,
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 15,
        "page": 1,
        "limit": 10
    }
}
```

### POST /messages/chats/:chatId/messages

Send message in chat (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "content": "Hello! I'm interested in your project. Can we discuss the requirements?"
}
```

### PUT /messages/chats/:chatId/read

Mark messages as read (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

### GET /messages/unread-count

Get unread message count (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
    "success": true,
    "data": {
        "unreadCount": 5
    }
}
```

### DELETE /messages/messages/:messageId

Delete message (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

## Reviews

### GET /reviews

Get all reviews with pagination

**Query Parameters:**

-   `page` (number): Page number
-   `limit` (number): Items per page
-   `rating` (number): Filter by rating (1-5)
-   `userId` (string): Filter by user ID

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "review_id",
                "rating": 5,
                "comment": "Excellent work! Very professional and delivered on time.",
                "service_quality": 5,
                "communication": 5,
                "value_for_money": 5,
                "reviewer": {
                    "_id": "reviewer_id",
                    "name": "Reviewer Name"
                },
                "reviewee": {
                    "_id": "reviewee_id",
                    "name": "Reviewee Name"
                },
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 25,
        "page": 1,
        "limit": 10
    }
}
```

### GET /reviews/:id

Get specific review by ID

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "review_id",
        "rating": 5,
        "comment": "Excellent work! Very professional and delivered on time.",
        "service_quality": 5,
        "communication": 5,
        "value_for_money": 5,
        "reviewer": {
            "_id": "reviewer_id",
            "name": "Reviewer Name"
        },
        "reviewee": {
            "_id": "reviewee_id",
            "name": "Reviewee Name"
        },
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

### GET /reviews/user/:userId

Get reviews for specific user

**Response:**

```json
{
    "success": true,
    "data": {
        "data": [
            {
                "_id": "review_id",
                "rating": 5,
                "comment": "Excellent work!",
                "reviewer": {
                    "_id": "reviewer_id",
                    "name": "Reviewer Name"
                },
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 10,
        "page": 1,
        "limit": 10
    }
}
```

### POST /reviews

Create new review (requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "rating": 5,
    "comment": "Excellent work! Very professional and delivered on time.",
    "service_quality": 5,
    "communication": 5,
    "value_for_money": 5,
    "service": "service_id"
}
```

### PUT /reviews/:id

Update review (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request:**

```json
{
    "rating": 4,
    "comment": "Updated review comment"
}
```

### DELETE /reviews/:id

Delete review (owner only, requires authentication)

**Headers:**

```
Authorization: Bearer jwt_token_here
```

## Error Responses

### Validation Error (400)

```json
{
    "success": false,
    "error": "Validation error message",
    "details": [
        {
            "field": "email",
            "message": "Email is required"
        }
    ]
}
```

### Authentication Error (401)

```json
{
    "success": false,
    "error": "Authentication required"
}
```

### Authorization Error (403)

```json
{
    "success": false,
    "error": "Access denied"
}
```

### Not Found Error (404)

```json
{
    "success": false,
    "error": "Resource not found"
}
```

### Server Error (500)

```json
{
    "success": false,
    "error": "Internal server error"
}
```

## Testing

Run the comprehensive test suite:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run only API endpoint tests
npm run test:api

# Use the test runner script
./run-tests.sh
```

## Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/feeshay
MONGODB_URI_TEST=mongodb://localhost:27017/feeshay_test

# JWT
JWT_SECRET=your-secret-key

# Server
PORT=3000
NODE_ENV=development
```
