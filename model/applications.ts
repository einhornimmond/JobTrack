import { db } from '../db'
import { type SQLQueryBindings } from 'bun:sqlite'

/*
mysql
CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `applying_date` date NOT NULL,
  `employer` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `webpage` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `position` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contact_person` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contact_person_gender` varchar(1) COLLATE utf8_unicode_ci NOT NULL,
  `acknowledgement_date` date NOT NULL,
  `interview_date` date NOT NULL,
  `declination_date` date NOT NULL,
  `acknowledged_occured` tinyint(1) NOT NULL,
  `interview_occured` tinyint(1) NOT NULL,
  `declination_occured` tinyint(1) NOT NULL,
  `contact_type_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL
);

php symfony
*/

class Application {
    id: number
    applying_date: Date
    employer: string
    webpage: string
    position: string
    contact_person: string
    contact_person_gender: string
    acknowledgement_date: Date
    interview_date: Date
    declination_date: Date
    acknowledged_occured: boolean
    interview_occured: boolean
    declination_occured: boolean
    contact_type_id: number
    status_id: number

    constructor(data: any) {
        this.id = data.id
        this.applying_date = data.applying_date
        this.employer = data.employer
        this.webpage = data.webpage
        this.position = data.position
        this.contact_person = data.contact_person
        this.contact_person_gender = data.contact
        this.acknowledgement_date = data.acknowledgement_date
        this.interview_date = data.interview_date
        this.declination_date = data.declination_date
        this.acknowledged_occured = data.acknowledged_occured
        this.interview_occured = data.interview_occured
        this.declination_occured = data.declination_occured
        this.contact_type_id = data.contact_type_id
        this.status_id = data.status_id
    }

    /*
    toSQLBindings(): SQLQueryBindings[] {
        return {
            id: this.id,
            applying_date: this.toISOStringOrNull(this.applying_date),
            employer: this.employer,
            webpage: this.webpage,
            position: this.position,
            contact_person: this.contact_person,
            contact_person_gender: this.contact_person_gender,
            acknowledgement_date: this.toISOStringOrNull(this.acknowledgement_date),
            interview_date: this.toISOStringOrNull(this.interview_date),
            declination_date: this.toISOStringOrNull(this.declination_date),
            acknowledged_occured: this.acknowledged_occured,
            interview_occured: this.interview_occured,
            declination_occured: this.declination_occured,
            contact_type_id: this.contact_type_id,
            status_id: this.status_id
        };
    }

    private toISOStringOrNull(date: Date | null): string | null {
        return date ? date.toISOString() : null;
    }
        */
}

export class ApplicationController {

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
            WHERE applying_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            ORDER BY applying_date DESC
        `)
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


