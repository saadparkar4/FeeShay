# FeeShay Frontend

A React Native frontend for the FeeShay freelancing platform.

## Features

-   **Authentication**: User registration and login with role-based access (freelancer/client)
-   **Job Management**: Create, view, and manage job postings
-   **Service Management**: Freelancers can create and manage their services
-   **Proposals**: Submit and manage job proposals
-   **Messaging**: Real-time chat between users
-   **Reviews**: Rate and review other users
-   **Profile Management**: Update user profiles and preferences

## API Integration

The frontend is now fully integrated with the FeeShay backend API. Key changes:

### Authentication

-   Uses email/password authentication
-   Supports both freelancer and client roles
-   JWT token-based authentication
-   Automatic token refresh and storage

### API Endpoints

-   **Auth**: `/api/v1/auth/*` - Registration, login, profile management
-   **Jobs**: `/api/v1/jobs/*` - Job CRUD operations
-   **Services**: `/api/v1/services/*` - Service CRUD operations
-   **Proposals**: `/api/v1/proposals/*` - Proposal management
-   **Messages**: `/api/v1/messages/*` - Chat functionality
-   **Reviews**: `/api/v1/reviews/*` - Review system

### Data Models

-   **User**: Email, role, preferences, timestamps
-   **Profile**: Name, bio, location, skills, profile image
-   **Job**: Title, description, budget, category, status
-   **Service**: Title, description, price, delivery time
-   **Proposal**: Cover letter, proposed price, status
-   **Message**: Content, sender, chat reference
-   **Review**: Rating, comment, sentiment analysis

## Setup

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Configure backend URL**: The frontend is configured to connect to `http://localhost:3000/api/v1` by default. Update the base URL in `src/api/index.ts` if needed.

3. **Start the backend**:

    ```bash
    cd ../Backend
    npm run setup  # Setup database with sample data
    npm start      # Start the server
    ```

4. **Start the frontend**:
    ```bash
    npm start
    ```

## Key Components

### API Layer

-   `src/api/index.ts` - Main API configuration and endpoints
-   `src/api/auth.ts` - Authentication API calls
-   `src/api/storage.ts` - Token storage utilities

### Context & Hooks

-   `src/contexts/AuthContext.tsx` - Authentication state management
-   `src/hooks/useQueries.ts` - React Query hooks for API calls
-   `src/hooks/useApi.ts` - Generic API hooks

### Providers

-   `src/providers/QueryProvider.tsx` - React Query configuration

## Usage Examples

### Authentication

```typescript
import { useAuth } from "../contexts/AuthContext";

const { login, register, user, isAuthenticated } = useAuth();

// Login
await login("user@example.com", "password");

// Register
await register("user@example.com", "password", "John Doe", "freelancer");
```

### API Calls

```typescript
import { useJobs, useCreateJob } from "../hooks/useQueries";

// Get jobs
const { data: jobs, loading, error } = useJobs();

// Create job
const createJobMutation = useCreateJob();
await createJobMutation.mutateAsync({
    title: "Web Development Project",
    description: "Need a React developer",
    budget_min: 1000,
    budget_max: 5000,
    category: "web-development",
});
```

## Development

### Adding New API Endpoints

1. Add the endpoint to `src/api/index.ts`
2. Create corresponding hooks in `src/hooks/useQueries.ts`
3. Use the hooks in your components

### Error Handling

-   API errors are automatically handled by React Query
-   Authentication errors trigger automatic logout
-   Network errors are retried with exponential backoff

### State Management

-   Authentication state is managed by AuthContext
-   API data is cached and managed by React Query
-   Local storage is used for token persistence

## Backend Integration

The frontend expects the backend to be running on `http://localhost:3000` with the following structure:

-   API routes under `/api/v1/`
-   JWT authentication with Bearer tokens
-   JSON responses with `success`, `data`, and `message` fields
-   File upload support for profile images
-   Real-time messaging capabilities

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured for your frontend URL
2. **Authentication errors**: Check token storage and backend JWT configuration
3. **API errors**: Verify backend is running and endpoints are correct

### Debug Mode

Enable debug logging by setting `console.log` statements in API calls or using React Query devtools.

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types for new features
3. Update this README for significant changes
4. Test API integration thoroughly
