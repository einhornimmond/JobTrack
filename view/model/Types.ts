import m from 'mithril'

import type { Option } from '../components/select'
import { StatusType } from '../../model/StatusType'
import { ContactType } from '../../model/ContactType'

export class Type<T extends Option> {
  private types: Map<number, T> = new Map()
  public constructor(url: string) {
    fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const types = await response.json()
      this.types = types.reduce(
        (map: Map<number, T>, type: T) => {
          map.set(type.id, type)
          return map
        }, new Map<number, T>())
      m.redraw()
    })
  }
  public getNameById(id: number): string {
    const type = this.types.get(id)
    return type ? type.name : id.toString()
  }

  public getOptions(): Option[] {
    return Array.from(this.types.values())
  }
}

export class StatusTypes extends Type<StatusType> {
  constructor(url: string) {
    super(url)
  }
}

export class ContactTypes extends Type<ContactType> {
  constructor(url: string) {
    super(url)
  }
}