const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to SQLite database
const db = new Database("database.db");

// Create internship table
db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        domain TEXT NOT NULL,
        mode TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        openings INTEGER NOT NULL
    )
`);

// Add sample data if database is empty
const count = db
    .prepare("SELECT COUNT(*) AS count FROM internships")
    .get();

if (count.count === 0) {

    const insert = db.prepare(`
        INSERT INTO internships
        (title, company, domain, mode, location, description, openings)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
        "Python Django Developer Intern",
        "Tech Solutions",
        "Python",
        "Remote",
        "India",
        "Work on backend development using Python and Django.",
        3
    );

    insert.run(
        "Frontend Developer Intern",
        "Web Creators",
        "Web Development",
        "Remote",
        "Mumbai",
        "Build websites using HTML, CSS and JavaScript.",
        2
    );

    insert.run(
        "C++ Developer Intern",
        "Code Labs",
        "C++",
        "On-site",
        "Pune",
        "Practice C++ programming and problem solving.",
        2
    );
}


// -----------------------------
// VALIDATION
// -----------------------------

function validateInternship(data) {

    const requiredFields = [
        "title",
        "company",
        "domain",
        "mode",
        "location",
        "description",
        "openings"
    ];

    for (const field of requiredFields) {

        if (
            data[field] === undefined ||
            data[field] === null ||
            data[field] === ""
        ) {
            return `${field} is required`;
        }
    }

    if (
        !Number.isInteger(data.openings) ||
        data.openings < 1
    ) {
        return "openings must be a positive integer";
    }

    return null;
}


// -----------------------------
// GET ALL INTERNSHIPS
// -----------------------------

app.get("/api/internships", (req, res) => {

    const page = Math.max(
        parseInt(req.query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(
            parseInt(req.query.limit) || 10,
            1
        ),
        50
    );

    const offset = (page - 1) * limit;

    const internships = db
        .prepare(`
            SELECT *
            FROM internships
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `)
        .all(limit, offset);

    const total = db
        .prepare(
            "SELECT COUNT(*) AS count FROM internships"
        )
        .get().count;

    res.status(200).json({
        success: true,
        data: internships,
        pagination: {
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit)
        }
    });
});


// -----------------------------
// GET ONE INTERNSHIP
// -----------------------------

app.get("/api/internships/:id", (req, res) => {

    const internship = db
        .prepare(
            "SELECT * FROM internships WHERE id = ?"
        )
        .get(req.params.id);

    if (!internship) {

        return res.status(404).json({
            success: false,
            error: "Internship not found"
        });
    }

    res.status(200).json({
        success: true,
        data: internship
    });
});


// -----------------------------
// CREATE INTERNSHIP
// -----------------------------

app.post("/api/internships", (req, res) => {

    const error = validateInternship(req.body);

    if (error) {

        return res.status(400).json({
            success: false,
            error: error
        });
    }

    const {
        title,
        company,
        domain,
        mode,
        location,
        description,
        openings
    } = req.body;

    const result = db
        .prepare(`
            INSERT INTO internships
            (
                title,
                company,
                domain,
                mode,
                location,
                description,
                openings
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
            title,
            company,
            domain,
            mode,
            location,
            description,
            openings
        );

    const internship = db
        .prepare(
            "SELECT * FROM internships WHERE id = ?"
        )
        .get(result.lastInsertRowid);

    res.status(201).json({
        success: true,
        data: internship
    });
});


// -----------------------------
// UPDATE INTERNSHIP
// -----------------------------

app.put("/api/internships/:id", (req, res) => {

    const error = validateInternship(req.body);

    if (error) {

        return res.status(400).json({
            success: false,
            error: error
        });
    }

    const existing = db
        .prepare(
            "SELECT * FROM internships WHERE id = ?"
        )
        .get(req.params.id);

    if (!existing) {

        return res.status(404).json({
            success: false,
            error: "Internship not found"
        });
    }

    const {
        title,
        company,
        domain,
        mode,
        location,
        description,
        openings
    } = req.body;

    db.prepare(`
        UPDATE internships
        SET
            title = ?,
            company = ?,
            domain = ?,
            mode = ?,
            location = ?,
            description = ?,
            openings = ?
        WHERE id = ?
    `).run(
        title,
        company,
        domain,
        mode,
        location,
        description,
        openings,
        req.params.id
    );

    const updated = db
        .prepare(
            "SELECT * FROM internships WHERE id = ?"
        )
        .get(req.params.id);

    res.status(200).json({
        success: true,
        data: updated
    });
});


// -----------------------------
// DELETE INTERNSHIP
// -----------------------------

app.delete("/api/internships/:id", (req, res) => {

    const result = db
        .prepare(
            "DELETE FROM internships WHERE id = ?"
        )
        .run(req.params.id);

    if (result.changes === 0) {

        return res.status(404).json({
            success: false,
            error: "Internship not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Internship deleted successfully"
    });
});


// -----------------------------
// UNKNOWN ROUTE
// -----------------------------

app.use((req, res) => {

    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});


// -----------------------------
// START SERVER
// -----------------------------

app.listen(PORT, () => {

    console.log(
        `API running at http://localhost:${PORT}`
    );

});