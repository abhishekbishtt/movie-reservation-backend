# Movie Booking API - Backend

This is the backend for a movie booking system. It handles user accounts, movie listings, seat bookings, and payments. Everything is built using Node.js, Express, and PostgreSQL.

## Features
- **User Authentication**: Secure login and signup with JWT.
- **Booking System**: Manage movies, theaters, showtimes, and seat reservations.
- **Payments**: Integrated with Razorpay for handling transactions.
- **Email Notifications**: Automated emails for booking confirmations.
- **Admin API**: Endpoints for admins to manage the entire theater catalog.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Payments**: Razorpay
- **Email**: Nodemailer

## How to run this locally

### 1. Clone the project
```bash
git clone https://github.com/abhishekbishtt/movie-reservation-backend.git
cd movie-reservation-backend
```

### 2. Set up the Backend
- Navigate to the project root: `cd backend`
- Install dependencies: `npm install`
- Create a `.env` file and add your DB and Razorpay credentials.
- Run migrations: `npx sequelize-cli db:migrate`
- Start the server: `npm run dev`

The API will be running on your local machine. You can test the endpoints using Postman or any API client.

---
Made by Abhishek Bisht 🚀
