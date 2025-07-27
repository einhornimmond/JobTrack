import { db } from './db'
import { type Application, applicationSchema, applicationTableName } from '../model/Application'
import type { Changes } from 'bun:sqlite'
import * as v from 'valibot'

function dateToDB(date?: Date | undefined): string {
    return date ? date.toISOString().split('T')[0] : ''
}

function getApplicationArray(sql: string): Application[] {
    return db.query(sql).all().map((application: any) => v.parse(applicationSchema, application))
}

function listAll(): Application[] {
    return getApplicationArray(
        `SELECT * FROM ${applicationTableName} ORDER BY applying_date DESC`
    )
}

function listLast6Month() : Application[] {
    return getApplicationArray(`
        SELECT * FROM ${applicationTableName}
        WHERE applying_date >= date('now', '-6 months')
        ORDER BY applying_date DESC
    `)
}

function show(id: number): Application | null {
    const result = v.safeParse(applicationSchema, db.query(`SELECT * FROM ${applicationTableName} WHERE id = ?1`).get(id))
    return result.success ? result.output : null
}

function upsert(application: Application): Changes {
    return application.id ? update(application) : add(application)
}

function add(application: Application): Changes {
    console.log('add')
    return db.run(
        `INSERT INTO ${applicationTableName} (applying_date, employer, webpage, position, contact_person, contact_person_gender, acknowledgement_date, interview_date, declination_date, acknowledged_occured, interview_occured, declination_occured, contact_type_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
        dateToDB(application.applying_date),
        application.employer,
        application.webpage,
        application.position,
        application.contact_person,
        application.contact_person_gender,
        dateToDB(application.acknowledgement_date),
        dateToDB(application.interview_date),
        dateToDB(application.declination_date),
        application.acknowledged_occured,
        application.interview_occured,
        application.declination_occured,
        application.contact_type_id,
        application.status_id,
        ]
    )
}

function update(updatedApplication: Application): Changes {
    return db.run(
        `UPDATE ${applicationTableName} SET applying_date = ?, employer = ?, webpage = ?, position = ?, contact_person = ?, contact_person_gender = ?, acknowledgement_date = ?, interview_date = ?, declination_date = ?, acknowledged_occured = ?, interview_occured = ?, declination_occured = ?, contact_type_id = ?, status_id = ? WHERE id = ?`,
        [
            dateToDB(updatedApplication.applying_date),
            updatedApplication.employer,
            updatedApplication.webpage,
            updatedApplication.position,
            updatedApplication.contact_person,
            updatedApplication.contact_person_gender,
            dateToDB(updatedApplication.acknowledgement_date),
            dateToDB(updatedApplication.interview_date),
            dateToDB(updatedApplication.declination_date),
            updatedApplication.acknowledged_occured,
            updatedApplication.interview_occured,
            updatedApplication.declination_occured,
            updatedApplication.contact_type_id,
            updatedApplication.status_id,
            updatedApplication.id!,
        ]
    )
}

function remove(id: number): Changes {
    return db.run(`DELETE FROM ${applicationTableName} WHERE id = ?`, [id])
}

export { listAll, listLast6Month, show, upsert, remove }
