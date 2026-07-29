````md
# NexaDesk - IT Support Ticket Management System

A full-stack IT help desk application built with React, Node.js, Express, and Supabase PostgreSQL for managing, tracking, and resolving support tickets.

---

## Features

- Secure JWT authentication
- Create, view, and manage support tickets
- Ticket comments and activity history
- Admin dashboard with ticket management
- Role-based access control
- Ticket status and priority management

---

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-4A4A4A?style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

---

## Quick Start

### Clone the repository

```bash
git clone https://github.com/Ellidan-web/NexaDesk-IT-Support-Ticket-Management-System.git
cd NexaDesk-IT-Support-Ticket-Management-System
```

### Install dependencies

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin123 |
| User | user@gmail.com | user123 |

---

## What I Learned

Building NexaDesk strengthened my understanding of:

- Full-stack application development with React and Express
- JWT authentication and secure password hashing with bcrypt
- Database design and management using Supabase PostgreSQL
- RESTful API development
- React Context API for state management
- Responsive UI development with Tailwind CSS
- Debugging, code organization, and Git workflows

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets/my` | Get user's tickets |
| GET | `/api/tickets/:id` | Get ticket details |
| PATCH | `/api/tickets/:id/status` | Update ticket status |
| PATCH | `/api/tickets/:id/priority` | Update ticket priority |
| POST | `/api/tickets/:id/comments` | Add a comment |
| GET | `/api/tickets/admin/all` | Get all tickets (Admin) |

---

## Author

**Ellidan-web**

---

## License

This project was built for educational and portfolio purposes.
````
