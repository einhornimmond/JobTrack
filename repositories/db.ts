import { Database } from 'bun:sqlite'
import { applicationTableName } from '../model/Application'
import { contactTypeTableName } from '../model/ContactType'
import { statusTypeTableName } from '../model/StatusType'

// Create the database
export const db = new Database('db.sqlite3')

// if it is a new sqlite db, create the tables
db.run(`
  CREATE TABLE IF NOT EXISTS ${applicationTableName} (
    id INTEGER PRIMARY KEY,
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

db.run(`CREATE TABLE IF NOT EXISTS ${contactTypeTableName} (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  )
`)

db.run(`CREATE TABLE IF NOT EXISTS ${statusTypeTableName} (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
)
`)