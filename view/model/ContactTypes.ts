import m from 'mithril'
import { ContactType } from '../../model/ContactType'
import type { Option } from '../components/select'

export class ContactTypes {
  private contactTypes: Map<number, ContactType> = new Map()
  public constructor(url: string) {
    fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const contactTypes = await response.json()
      this.contactTypes = contactTypes.reduce((map: Map<number, ContactType>, contactType: ContactType) => {
        map.set(contactType.id, contactType)
        return map
      }
      , new Map())
      m.redraw()
    })
  }
  public getNameById(id: number): string {
    const contactType = this.contactTypes.get(id)
    return contactType ? contactType.name : id.toString()
  }

  public getOptions(): Option[] {
    return Array.from(this.contactTypes.values()).map((contactType) => ({
      id: contactType.id,
      name: contactType.name
    }))
  }
}