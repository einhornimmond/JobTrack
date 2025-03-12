import { Database } from "bun:sqlite"

// Create the database
export const db = new Database("db.sqlite3")

// if it is a new sqlite db, create the tables
db.run(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applying_date TEXT NOT NULL,
    employer TEXT NOT NULL,
    webpage TEXT NOT NULL,
    position TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_person_gender TEXT NOT NULL,
    acknowledgement_date TEXT,
    interview_date TEXT,
    declination_date TEXT,
    acknowledged_occured BOOLEAN NOT NULL,
    interview_occured BOOLEAN NOT NULL,
    declination_occured BOOLEAN NOT NULL,
    contact_type_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL
  )
`)