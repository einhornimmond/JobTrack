
import { db } from '../db'
import { Application } from '../model/Application'

export class ApplicationController 
{
    private async getApplicationArray(sql: string): Promise<Application[]> {
        return db.query(sql).as(Application).all()
    }

    async indexAction(): Promise<Application[]> {
        return this.getApplicationArray(
            'SELECT * FROM applications ORDER BY applying_date DESC'
        )
    }

    async last6MonthAction() {
        return this.getApplicationArray(`
            SELECT * FROM applications
            WHERE applying_date >= date('now', '-6 months')
            ORDER BY applying_date DESC
        `)
    }

    async showAction(id: number): Promise<Application | null> {
        return db.query('SELECT * FROM applications WHERE id = ?1').as(Application).get(id)  
    }

    async addAction(application: Application) {
        db.run(
            `INSERT INTO applications (applying_date, employer, webpage, position, contact_person, contact_person_gender, acknowledgement_date, interview_date, declination_date, acknowledged_occured, interview_occured, declination_occured, contact_type_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    async editAction(updatedApplication: Application) {
        db.run(
            `UPDATE applications SET applying_date = ?, employer = ?, webpage = ?, position = ?, contact_person = ?, contact_person_gender = ?, acknowledgement_date = ?, interview_date = ?, declination_date = ?, acknowledged_occured = ?, interview_occured = ?, declination_occured = ?, contact_type_id = ?, status_id = ? WHERE id = ?`,
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

    async deleteAction(id: number) {
        db.run("DELETE FROM applications WHERE id = ?", [id])
    }
}

