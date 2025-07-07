# FeeShay Backend API

A comprehensive Node.js/Express backend API for the FeeShay freelancing platform, built with TypeScript, MongoDB, and Mongoose.

## 🚀 Features

-   **Authentication & Authorization**: JWT-based authentication with role-based access control
-   **User Management**: Freelancer and client profile management
-   **Job Management**: Create, read, update, and delete job postings
-   **Service Management**: Freelancer service offerings
-   **Proposal System**: Job proposal submission and management
-   **Messaging System**: Real-time chat functionality
-   **Review System**: User ratings and reviews
-   **File Upload**: Image upload for profiles and portfolios
-   **Validation**: Comprehensive input validation using express-validator
-   **Error Handling**: Centralized error handling with detailed error messages

## 📋 Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (v4.4 or higher)
-   npm or yarn

## 🛠️ Installation

1. **Clone the repository**

    ```bash
    cd FeeShay/Backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup** Create a `.env` file in the root directory:

    ```env
    # Database Configuration
    MONGODB_URI=mongodb://localhost:27017/feeshay
    MONGODB_URI_PROD=mongodb://localhost:27017/feeshay

    # JWT Configuration
    JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    JWT_EXPIRES_IN=7d

    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # File Upload Configuration
    MAX_FILE_SIZE=5242880
    UPLOAD_PATH=uploads

    # CORS Configuration
    CORS_ORIGIN=http://localhost:3000

    # AI Integration (Optional)
    OPENAI_API_KEY=your-openai-api-key
    GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key
    ```

4. **Start MongoDB** Make sure MongoDB is running on your system.

5. **Run the application**
    ```bash
    npm start
    ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "freelancer",
  "name": "John Doe"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile

```http
GET /auth/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Updated bio",
  "location": "New York",
  "skills": ["JavaScript", "React"],
  "languages": ["English", "Spanish"]
}
```

### Job Endpoints

#### Get All Jobs

```http
GET /jobs?page=1&limit=10&status=open&category=web-development
```

#### Create Job (Client Only)

```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Development Project",
  "description": "Need a responsive website",
  "category": "category_id",
  "budget_min": 1000,
  "budget_max": 5000,
  "is_internship": false
}
```

#### Get My Jobs (Client Only)

```http
GET /jobs/my/jobs?page=1&limit=10
Authorization: Bearer <token>
```

### Service Endpoints

#### Get All Services

```http
GET /services?page=1&limit=10&status=active&category=web-development
```

#### Create Service (Freelancer Only)

```http
POST /services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Development Service",
  "description": "Professional web development",
  "category": "category_id",
  "price": 1500,
  "delivery_time_days": 14
}
```

### Proposal Endpoints

#### Submit Proposal (Freelancer Only)

```http
POST /proposals
Authorization: Bearer <token>
Content-Type: application/json

{
  "job": "job_id",
  "cover_letter": "I'm interested in this project...",
  "proposed_price": 2000
}
```

#### Get Job Proposals (Client Only)

```http
GET /proposals/job/job_id?page=1&limit=10
Authorization: Bearer <token>
```

### Messaging Endpoints

#### Create Chat

```http
POST /messages/chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "otherUserId": "user_id"
}
```

#### Get My Chats

```http
GET /messages/chats?page=1&limit=10
Authorization: Bearer <token>
```

#### Send Message

```http
POST /messages/chats/chat_id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello! How are you?",
  "language": "en"
}
```

#### Get Chat Messages

```http
GET /messages/chats/chat_id/messages?page=1&limit=50
Authorization: Bearer <token>
```

### Review Endpoints

#### Create Review

```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewee": "user_id",
  "job": "job_id",
  "rating": 5,
  "comment": "Great work!"
}
```

#### Get User Reviews

```http
GET /reviews/user/user_id?type=received&page=1&limit=10
```

## 🗄️ Database Schema

### User

-   `email`: String (unique, required)
-   `password_hash`: String (required)
-   `role`: String (enum: 'freelancer', 'client')
-   `created_at`: Date
-   `last_login`: Date
-   `dark_mode`: Boolean
-   `is_active`: Boolean

### FreelancerProfile

-   `user`: ObjectId (ref: User)
-   `name`: String (required)
-   `bio`: String
-   `location`: String
-   `languages`: [String]
-   `skills`: [String]
-   `profile_image_url`: String
-   `member_since`: Date
-   `onboarding_complete`: Boolean

### Job

-   `client`: ObjectId (ref: ClientProfile)
-   `title`: String (required)
-   `description`: String
-   `category`: ObjectId (ref: Category)
-   `budget_min`: Decimal128
-   `budget_max`: Decimal128
-   `is_internship`: Boolean
-   `status`: String (enum: 'open', 'in_progress', 'completed', 'cancelled')
-   `created_at`: Date
-   `updated_at`: Date
-   `draft`: Boolean

### Service

-   `freelancer`: ObjectId (ref: FreelancerProfile)
-   `title`: String (required)
-   `description`: String
-   `category`: ObjectId (ref: Category)
-   `price`: Decimal128
-   `delivery_time_days`: Number
-   `status`: String (enum: 'active', 'paused', 'archived')
-   `created_at`: Date
-   `updated_at`: Date

### Proposal

-   `job`: ObjectId (ref: Job)
-   `freelancer`: ObjectId (ref: FreelancerProfile)
-   `cover_letter`: String
-   `proposed_price`: Decimal128
-   `status`: String (enum: 'active', 'completed', 'cancelled', 'rejected')
-   `created_at`: Date
-   `updated_at`: Date

### Chat

-   `user1`: ObjectId (ref: User)
-   `user2`: ObjectId (ref: User)
-   `created_at`: Date
-   `last_message_at`: Date

### Message

-   `chat`: ObjectId (ref: Chat)
-   `sender`: ObjectId (ref: User)
-   `content`: String
-   `sent_at`: Date
-   `read_at`: Date
-   `language`: String
-   `translated_content`: String

### Review

-   `reviewer`: ObjectId (ref: User)
-   `reviewee`: ObjectId (ref: User)
-   `job`: ObjectId (ref: Job)
-   `rating`: Number (1-5)
-   `comment`: String
-   `sentiment`: String (enum: 'positive', 'neutral', 'negative')
-   `created_at`: Date

## 🔧 Development

### Scripts

-   `npm start`: Start the development server with nodemon
-   `npm run build`: Build the TypeScript code
-   `npm run test`: Run tests (when implemented)

### Project Structure

```
src/
├── config/
│   └── database.ts          # Database connection
├── controllers/
│   ├── authController.ts     # Authentication logic
│   ├── jobController.ts      # Job management
│   ├── serviceController.ts  # Service management
│   ├── proposalController.ts # Proposal handling
│   ├── messageController.ts  # Messaging system
│   └── reviewController.ts   # Review system
├── middlewares/
│   ├── auth.ts              # JWT authentication
│   ├── validation.ts        # Input validation
│   ├── errorHandler.ts      # Error handling
│   └── upload.ts            # File upload handling
├── models/
│   └── index.ts             # Mongoose schemas
├── routes/
│   ├── auth.ts              # Auth routes
│   ├── jobs.ts              # Job routes
│   ├── services.ts          # Service routes
│   ├── proposals.ts         # Proposal routes
│   ├── messages.ts          # Message routes
│   ├── reviews.ts           # Review routes
│   └── index.ts             # Main router
├── app.ts                   # Express app setup
└── server.ts                # Server entry point
```

## 🔒 Security Features

-   JWT-based authentication
-   Password hashing with bcrypt
-   Input validation and sanitization
-   CORS configuration
-   Rate limiting (can be added)
-   File upload security

## 🚀 Deployment

1. Set environment variables for production
2. Build the TypeScript code: `npm run build`
3. Start the production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
