# SkillUp Training Institute — Full-Stack Website

A polished, responsive training institute website with a premium visual design, built with:
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt password hashing

## Features

- Responsive home, about, and courses sections
- Courses loaded from an Express API
- Student registration and login
- Passwords hashed before they are saved
- JWT-protected `/api/auth/me` endpoint
- Contact form that stores enquiries in MongoDB
- Input validation, Helmet security headers, and auth rate limiting

## Requirements

Install:
1. Node.js (LTS version) from https://nodejs.org/
2. MongoDB Community Server locally, OR create a MongoDB Atlas database at https://www.mongodb.com/atlas

## Setup in VS Code (Windows PowerShell)

1. Extract the ZIP and open the `skillup-training-institute` folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Install the packages:

   ```powershell
   npm install
   ```

4. Copy the environment template:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Open `.env` and set `JWT_SECRET` to a long, random secret. For local MongoDB, the provided URI works if the MongoDB service is running:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/skillup_training
   JWT_SECRET=replace_this_with_a_long_random_secret_before_using
   NODE_ENV=development
   ```

   Do not share your `.env` file or commit it to GitHub.

6. Start the server:

   ```powershell
   npm start
   ```

7. Open **http://localhost:5000** in your browser.

The server creates the MongoDB collections automatically when the first user or contact is saved. Courses are currently sample data served by the backend; they are not stored in MongoDB.

## Using MongoDB Atlas instead of local MongoDB

- Create a database and database user in Atlas.
- Add your computer's IP address to the Atlas Network Access allowlist.
- Copy the application's connection string into `MONGODB_URI` in `.env`.
- Replace the username, password, and database name in the URI. URL-encode special characters in the database password.
- Restart the server.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server/database status |
| GET | `/api/courses` | Get the sample course list |
| POST | `/api/auth/register` | Create a student account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user (Bearer token required) |
| POST | `/api/contact` | Save a contact enquiry |

Example registration body:

```json
{
  "name": "Asha Student",
  "email": "asha@example.com",
  "password": "example-password-123"
}
```

Example contact body:

```json
{
  "name": "Asha Student",
  "email": "asha@example.com",
  "message": "Please share details about the web development course."
}
```

## Important security notes

This is an educational starter project, not a production-ready student management system.
- The browser stores the JWT in `localStorage`; an XSS vulnerability could expose it. For production, consider secure, HttpOnly cookies and CSRF protection.
- Set a strong, unique `JWT_SECRET`; never use the example secret in a deployed app.
- Use HTTPS in production, configure rate limits for all public endpoints, and add email verification/password recovery before real use.
- The contact form is public and has no admin dashboard yet. Contact records should only be exposed through an authenticated, authorized admin endpoint if you add one.
- The course list is sample data in `src/routes/courses.js`. Edit that array to change the displayed courses.

## Troubleshooting

- **MongoDB connection failed:** Start the MongoDB service or check `MONGODB_URI` and Atlas network access.
- **`npm` is not recognized:** Install Node.js LTS, then close and reopen VS Code.
- **Port already in use:** Change `PORT=5001` in `.env` and open `http://localhost:5001`.
- **`JWT_SECRET` missing:** Ensure `.env` exists in the project root and contains `JWT_SECRET=...`.
