# NestJS Application

## Description

This is a NestJS application that provides user management functionalities, including user creation, fetching user details, and handling user avatars. It integrates with RabbitMQ for event-driven communication and includes a simple email service.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Endpoints](#endpoints)

## Installation

1. Install Dependencies:

   ```bash
    cd project
    npm install
   ```

## Environment Variables
1. Create a .env file in the root directory and set the following variables:
  ```env
    RABBITMQ_URL=amqp://127.0.0.1:5672
    MONGO_URI=                   //mongodb+srv://<username>:<password>@cluster0.5x4b4gx.mongodb.net
    PORT=3000
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=                                                       //gmail:xyz@gmail.com
    EMAIL_PASS=                                                         //password
  ```

## Running the Application

1. Ensure RabbitMQ is running.
2. Start the application
    ```bash
    npm run start
    ```
3. The application should now be running at http://localhost:3000

## Testing
1. Unit Tests
   ```bash
    npm run test
    ```

## Folder Structure
   ```arduino
      src/
      ├── user/
      │   ├── user.controller.ts
      │   ├── user.service.ts
      │   ├── user.module.ts
      │   ├── schemas/
      │   │   └── user.schema.ts
      │   └── __tests__/
      │       ├── user.controller.spec.ts
      │       └── user.service.spec.ts
      ├── rabbitmq/
      │   ├── rabbitmq.module.ts
      │   └── rabbitmq.service.ts
      ├── utils/
      │   └── email.service.ts
```

## Endpoints
1. Create User
    POST `/api/users`
    Request Body
    ```json
      {
        "name": "John Doe",
        "email": "johndoe@example.com"
      }
    ```
    Response
    ```json
        {
          "id": "user_id",
          "name": "John Doe",
          "email": "johndoe@example.com"
        }
    ```
This endpoint creates a new user, sends a welcome email, and emits a RabbitMQ event.

2. GET User from `reqres.in`
    Request:
      GET `https://reqres.in/api/users/{userId}`
    Response:
      ```json
          {
            "data": {
                "id": 3,
                "email": "emma.wong@reqres.in",
                "first_name": "Emma",
                "last_name": "Wong",
                "avatar": "https://reqres.in/img/faces/3-image.jpg"
            },
            "support": {
                "url": "https://reqres.in/#support-heading",
                "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
            }
          }
          ```



3. Get User avatar
    GET `/api/users/:userId/avatar`

    Response
    ```json
      {
        "avatar": "<base64_encoded_image>"
      }
    ```
This endpoint fetches the user's avatar. If the avatar does not exist, it retrieves the avatar from a placeholder service and saves it locally.

4. Delete User avatar
    DELETE `/api/users/:userId/avatar`
    Response
    ```json
        {
          "message": "Avatar deleted successfully."
        }
    ```
    This endpoint deletes the user's avatar from the server.
