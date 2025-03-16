import { StatusType } from '../../model/StatusType'

export class StatusTypes {
  private statusTypes: Map<number, StatusType> = new Map()
  public constructor(url: string) {
    console.log('StatusTypes constructor')
    fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const statusTypes = await response.json()
      this.statusTypes = statusTypes.reduce((map: Map<number, StatusType>, statusType: StatusType) => {
        map.set(statusType.id, statusType)
        return map
      }, new Map())
    })
  }

  public getNameById(id: number): string {
    const statusType = this.statusTypes.get(id)
    return statusType ? statusType.name : id.toString()
  }
}