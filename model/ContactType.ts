export const contactTypeTableName = 'entity_contact_type'

export class ContactType {
    id: number
    name: string
   
    constructor(data: any) {
        this.id = data.id
        this.name = data.name
    }
}