# Internship REST API

A beginner-friendly REST API for managing internship records using Node.js, Express.js, and SQLite.

## Technologies Used

* Node.js
* Express.js
* SQLite
* better-sqlite3

## Project Structure

```text
intership/
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
└── database.db
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

## Database Schema

The `internships` table contains:

| Field       | Type    | Description            |
| ----------- | ------- | ---------------------- |
| id          | INTEGER | Unique internship ID   |
| title       | TEXT    | Internship title       |
| company     | TEXT    | Company name           |
| domain      | TEXT    | Internship domain      |
| mode        | TEXT    | Remote or On-site      |
| location    | TEXT    | Internship location    |
| description | TEXT    | Internship description |
| openings    | INTEGER | Number of openings     |

## API Endpoints

### Get all internships

```http
GET /api/internships
```

Example:

```text
http://localhost:3000/api/internships
```

### Pagination

```http
GET /api/internships?page=1&limit=10
```

### Get one internship

```http
GET /api/internships/1
```

### Create an internship

```http
POST /api/internships
```

Example JSON:

```json
{
  "title": "Java Developer Intern",
  "company": "Software Hub",
  "domain": "Java",
  "mode": "Remote",
  "location": "Pune",
  "description": "Learn Java application development.",
  "openings": 2
}
```

### Update an internship

```http
PUT /api/internships/4
```

Example JSON:

```json
{
  "title": "Java Full Stack Intern",
  "company": "Software Hub",
  "domain": "Java",
  "mode": "Remote",
  "location": "Pune",
  "description": "Learn Java and backend development.",
  "openings": 4
}
```

### Delete an internship

```http
DELETE /api/internships/4
```

## Validation

The API validates that:

* Required fields are provided.
* Text fields are not empty.
* `openings` is a positive integer.
* Invalid internship IDs return `404`.
* Invalid input returns `400`.

## Response Format

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "error": "Internship not found"
}
```

## Seed Data

The application automatically creates the database and inserts sample internship records when the database is empty.

Sample domains include:

* Python
* Web Development
* C++
