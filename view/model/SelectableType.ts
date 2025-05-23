import type { Option } from '../components/select'
import { StatusType } from '../../model/StatusType'
import { ContactType } from '../../model/ContactType'
import type { ApiRoutes } from '../type/ApiRoutes'

export class SelectableType<T extends Option> {
  private types: Map<number, T> = new Map()
  private apiRoutes: ApiRoutes
  public constructor(apiRoutes: ApiRoutes) {
    this.apiRoutes = apiRoutes
  }

  public async init(): Promise<void> {
    const response = await fetch(this.apiRoutes.listAll, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
    })
    if (!response.ok) {
      throw new Error(`Error calling: ${this.apiRoutes.listAll}`)
    } 
    const types = await response.json() as T[]
    this.types = types.reduce(
      (map: Map<number, T>, type: T) => {
        map.set(type.id, type)
        return map
        }, new Map<number, T>())
  }

  public async add(name: string): Promise<T> {
    const response = await fetch(this.apiRoutes.upsert, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ name })
    })
    if (!response.ok) {
      throw new Error(`Error calling: ${this.apiRoutes.upsert} with data: ${JSON.stringify({ name })}`)
    }
    const responseData = await response.json() as T
    this.types.set(responseData.id, responseData) 
    return responseData
  }

  public getNameById(id: number): string {
    const type = this.types.get(id)
    return type ? type.name : id.toString()
  }

  public getOptions(): T[] {
    return Array.from(this.types.values())
  }
}

export class StatusTypes extends SelectableType<StatusType> {
  constructor(apiRoutes: ApiRoutes) {
    super(apiRoutes)
  }
}

export class ContactTypes extends SelectableType<ContactType> {
  constructor(apiRoutes: ApiRoutes) {
    super(apiRoutes)
  }
}