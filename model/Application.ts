export class Application {
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

    private getDate(input: Date | string): Date {
        if (typeof input === 'string') {
            return new Date(input)
        } else {
            return input
        }
    }

    constructor(data: any) {
        this.id = data.id
        this.applying_date = this.getDate(data.applying_date)
        this.employer = data.employer
        this.webpage = data.webpage
        this.position = data.position
        this.contact_person = data.contact_person
        this.contact_person_gender = data.contact
        this.acknowledgement_date = this.getDate(data.acknowledgement_date)
        this.interview_date = this.getDate(data.interview_date)
        this.declination_date = this.getDate(data.declination_date)
        this.acknowledged_occured = data.acknowledged_occured
        this.interview_occured = data.interview_occured
        this.declination_occured = data.declination_occured
        this.contact_type_id = data.contact_type_id
        this.status_id = data.status_id
    }
}