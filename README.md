# Taskology

Taskology is a **Full-Stack web application** designed to streamline task management with features like adding tasks and tracking their status **(Pending, Completed, Done)**. It incorporates a secure authentication system, enabling users to register, log in, and reset forgotten passwords through an **OTP-based reset mechanism**.

Additionally, **Google Authentication** is integrated for a seamless login experience. Taskology also offers a social **feeds** feature, allowing users to share posts with **images** and **captions** while exploring feeds from other users.

This live project showcases a combination of robust functionality and engaging user interaction, making task management and social interaction efficient and enjoyable.

### Features:
- **Authentication**: User can register and reset their Password.
- **Google Authentication System**: User can Login Using Google Account.
- **Task**: Drag and from features of mannaging the status of task.
- **Feed Post**: User can Post feeds and see others feeds.
- **Responsive design**: Works seamlessly across devices (desktop, tablet, mobile).

---

## Setup Instructions

### 1. Clone the repository
To get started with the project, first clone the repository to your local machine:

```bash
git clone https://github.com/INDRAJEET8021/Taskology.git
```

### 2. Install Dependencies
The project consists of both frontend (React) and backend (Node.js). You need to install dependencies for both parts of the application.

```bash
npm install
```

For the backend, navigate to the backend directory and run:

```bash
cd backend
npm install
```

### 3. Set up Environment Variables
You will need to configure environment variables for both the frontend and backend.

#### Frontend (.env)
Create a .env file in the frontend directory (Root) and add your REACT_APP_BACKEND_API: Like (http://localhost:5000/) etc.

```
REACT_APP_BACKEND_API=your_backend_api
```

#### Backend (.env)
Create a .env file in the backend directory and add your OMDB API key along with your database and JWT secrets:

```
DB_CONFIG=mongodb_string

JWT_SECRET = jwt_secret

CLOUD_NAME= cloudinary_name

API_KEY= cloudinary_api_key

API_SECRET= cloudinry_api_secret

PORT=port

EMAIL_USER=your_valid email

EMAIL_PASS=email_password

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=google_client_secret

SESSION_SECRET=secret_code

MONGO_CLOUD=cloud_mongoDB_URL (Optional)

CLIENT_URL=http://localhost:3000 or etc.
```

### 4. Start the Project
For the frontend, run the following command in the frontend directory:
```
npm run start
```
For the backend, run the following command in the backend 
```
cd backend
npm run dev
```
## API Documentation
### 1. Authentication
To register .

**Method**: `POST` 
```
Base URL: /auth/register
```
To login .

**Method**: `POST` 
```
Base URL: /auth/login
```
To Forgot Password and OTP Generate .

**Method**: `POST` 
```
Base URL: /passwordConfig/forgot-password

```
To reset password .

**Method**: `POST` 
```
Base URL: /passwordConfig/reset-password
```

To login with google .

**Method**: `GET` 
```
Base URL: /auth/google
```
### 2. Feeds

To See Feeds .

**Method**: `GET` 
```
Base URL: /feeds/all
```

To Add Feeds .

**Method**: `POST` 
```
Base URL: /feeds/add-feed

```

### 3. Tasks

To add Task .

**Method**: `POST` 
```
Base URL: /task/add
```

To Chnage Status .

**Method**: `POS` 
```
Base URL: /task/:id/status
```

To See All Users Tasks .

**Method**: `GET`   

```

Base URL: /task/user-task
```
To Edit Task .

**Method**: `POST`   

```
Base URL: /task/:id/detail-update
```

To Delete Task .

**Method**: `POST`  
```
Base URL: /task/:id/delete
```

## Deployment ##

### Frontend Deployment: ###
Frontend is Deployed on vercel.

### Backend Deployment: ###
Backend is Deployed on Render.
### Cloud Database ###

**`MongoDB Cloud`** is used for clud database

**`Cloudinary`** is used for uploading images

## List of Implemented Features ##

### 1. Authentication ###

JWT Based Authentication ,Google Authentication System and OTP Based Password reset .

### 2.  Task Management ###
Drang and Drop Functionality of adding and mannaging task status as per prefrence.

### 3. Feed Post and visuals

User can Post Feeds and see all posts and Caption.

### 4. Drag and Drop  Functoinality

Users can remove movies from their favorites list at any time.

### 5. Responsive Design

The app is fully responsive and adjusts to different screen sizes (desktop, tablet, mobile).


###  6. Backend API Integration

Node.js backend to manage the API calls and handle data.
Implements secure endpoints to handle users JWT-based authentication system.


### 7. Cross-Platform Compatibility

Fully tested and optimized for cross-browser compatibility (Chrome, Firefox, Safari, Edge, etc.).



