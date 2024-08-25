# Multi-User Task Management API

Welcome to the Multi-User Task Management API project! This API allows for managing users, tasks, tags, comments, and notifications in a task management system. 

## Features

- **User Management**: Registration, login, and role-based access (Admin and Regular User).
- **Task Management**: Create, assign, update, and manage tasks.
- **Tagging System**: Add and filter tasks by tags.
- **Commenting System**: Add, edit, and delete comments.
- **Notifications**: Notify users on task assignments and updates.
- **Pagination & Sorting**: Sort and paginate tasks.
- **Validation**: Payload validation for all endpoints.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Documentation**: Postman

## Database Design

![Database Design](./docs/db.png)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL (version 12 or higher)
- Redis (for caching)
- Postman (API test and Documentation)

### Prerequisites(optional)

- Docker (Alternative to start the app)

### Installation

#### Without Docker

1. **Clone the Repository**

   ```bash
   git clone https://github.com/lekejosh/p2vest.git
   cd p2vest
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=9999
   DATABASE_URL=postgres://username:password@localhost:5432/mydatabase
   JWT_SECRET=mysecretkey
   REDIS_URL=redis://localhost:6000
   ```

4. **Run Database Migrations**

   Ensure PostgreSQL is running and execute the migrations:

   ```bash
   npm run prisma:prod
   ```

5. **Start the Application**

   ```bash
   npm start
   ```

   For development, you can use:

   ```bash
   npx prisma db seed && npm run dev
   ```

#### With Docker

1. **Clone the Repository**

   ```bash
   git clone https://github.com/lekejosh/p2vest.git
   cd p2vest
   ```

2. **Build and Run Docker Containers**

   ```bash
   docker compose up
   ```

   This will set up the PostgreSQL database, Redis cache, and the application.


3. **Access the Application**

   The application should be accessible at `http://localhost:9999`.

### API Documentation

The API is documented using Postman and can be found in the `docs` directory:

   ```plaintext
   docs/p2vest.json
   ```

 Import the documentation into your postman

### Admin Credentials

To log in as an admin, use the following credentials:

- emailOrUsername: admin
- Password: securepassword123

### Database Diagram

A visual representation of the database schema can be found in the `docs` directory:

   ```plaintext
   docs/db.png
   ```

You can use this diagram to understand the relationships between the tables.

### Usage

- **Registration, Login and Refresh of Access Token**: Use the `/v1/auth`, `/v1/auth/login` and `/v1/auth/tokens/refresh` endpoints.
- **Task Management**: Use endpoints under `/v1/tasks` for CRUD operations.
- **Tagging System**: Add and filter tasks by tags using endpoints under `/v1/tags`.
- **Commenting System**: Manage comments with endpoints under `/v1/comments`.
- **Notifications**: Receive notifications through WebSockets or API endpoints under `/v1/notifications`.



## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Contact

For any questions or clarifications, you can reach me at [lekejosh6wf@gmail.com](mailto:lekejosh6wf@gmail.com).
