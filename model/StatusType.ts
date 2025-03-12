export const statusTypeTableName = 'status_types'

export class StatusType {
    id: number
    name: string
   
    constructor(data: any) {
        this.id = data.id
        this.name = data.name
    }
}