import { db } from './db'
import { Application, applicationTableName } from '../model/Application'
import type { Changes } from 'bun:sqlite'

function getApplicationArray(sql: string): Application[] {
    return db.query(sql).as(Application).all()
}

function listAll(): Application[] {
    return getApplicationArray(
        `SELECT * FROM ${applicationTableName} ORDER BY applying_date DESC`
    )
}

function listLast6Month() {
    return getApplicationArray(`
        SELECT * FROM ${applicationTableName}
        WHERE applying_date >= date('now', '-6 months')
        ORDER BY applying_date DESC
    `)
}

function show(id: number): Application | null {
    return db.query(`SELECT * FROM ${applicationTableName} WHERE id = ?1`).as(Application).get(id)  
}

function upsert(application: Application): Changes {
    if(application.id > 0) {
        return update(application)
    } else {
        return add(application)
    }
}

function add(application: Application): Changes {
    return db.run(
        `INSERT INTO ${applicationTableName} (applying_date, employer, webpage, position, contact_person, contact_person_gender, acknowledgement_date, interview_date, declination_date, acknowledged_occured, interview_occured, declination_occured, contact_type_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
        application.applying_date.toISOString().split('T')[0],
        application.employer,
        application.webpage,
        application.position,
        application.contact_person,
        application.contact_person_gender,
        application.acknowledgement_date.toISOString().split('T')[0],
        application.interview_date.toISOString().split('T')[0],
        application.declination_date.toISOString().split('T')[0],
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
            updatedApplication.applying_date.toISOString().split('T')[0],
            updatedApplication.employer,
            updatedApplication.webpage,
            updatedApplication.position,
            updatedApplication.contact_person,
            updatedApplication.contact_person_gender,
            updatedApplication.acknowledgement_date.toISOString().split('T')[0],
            updatedApplication.interview_date.toISOString().split('T')[0],
            updatedApplication.declination_date.toISOString().split('T')[0],
            updatedApplication.acknowledged_occured,
            updatedApplication.interview_occured,
            updatedApplication.declination_occured,
            updatedApplication.contact_type_id,
            updatedApplication.status_id,
            updatedApplication.id,
        ]
    )
}

function remove(id: number): Changes {
    return db.run(`DELETE FROM ${applicationTableName} WHERE id = ?`, [id])
}

export { listAll, listLast6Month, show, upsert, remove }
