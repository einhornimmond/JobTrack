import m from 'mithril'
import { Select, type Option, type Attrs as SelectAttrs } from './select'
import { 
  Application, 
  type DateField, 
  type BooleanField, 
  type NumberField, 
  type StringField 
} from '../../model/Application'
import { SelectableType } from '../model/SelectableType'

interface Attrs {
  
}

export class ApplicationForm implements m.ClassComponent<Attrs> {
  private application: Application

  constructor() {
    this.application = new Application(null)
  }

  inputField(label: string, fieldName: StringField | DateField, type: string = 'text', oninput: (e: Event) => void) {
    return m('div', { class: 'mb-4' }, [
      m('label', { class: 'block text-sm font-semibold' }, label),
      m('input', {
        class: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        type: type,
        value: this.application[fieldName],
        oninput: oninput,
      })
    ]);
  }

  textField(label: string, fieldName: StringField, type: string = 'text') {
    return this.inputField(label, fieldName, type, (e: Event) => {
      const input = e.target as HTMLInputElement
      this.application[fieldName] = input.value; 
    })
  }

  dateField(label: string, fieldName: DateField) {
    return this.inputField(label, fieldName, 'date', (e: Event) => {
      const input = e.target as HTMLInputElement
      this.application[fieldName] = new Date(input.value); 
    })
  }

  checkboxField(label: string, fieldName: BooleanField){
    return m('div', { class: 'mb-4 flex items-center' }, [
      m('input', {
        type: 'checkbox',
        class: 'mr-2',
        checked: this.application[fieldName],
        onchange: (e: Event) => {
          const input = e.target as HTMLInputElement
          this.application[fieldName] = input.checked; 
        },
      }),
      m('label', { class: 'text-sm font-semibold' }, label),
    ]);
  }

  selectField<T extends Option>(selectableType: SelectableType<T>, label: string, fieldName: NumberField, placeholder?: string, addUrl?: string) {
    return m(Select<T>, {
      selectableType,
      value: this.application[fieldName],
      onchange: (e: number) => this.application[fieldName] = e,
      label,
      placeholder,
      addUrl
    } as SelectAttrs<T>);
  }

  view() {
    console.log(this.application)
    return m('form.container.w-3/5.mx-auto.text-stone-200', { class: 'space-y-6' }, [
      this.textField('Arbeitgeber', 'employer'),
      this.textField('Webseite', 'webpage', 'url'),
      this.textField('Position', 'position'),
      this.textField('Kontaktperson', 'contact_person'),
      this.textField('Kontaktperson (Geschlecht)', 'contact_person_gender'),

      this.dateField('Bewerbungsdatum', 'applying_date'),
      this.dateField('Zusage-Datum', 'acknowledgement_date'),
      this.dateField('Vorstellungsgespräch-Datum', 'interview_date'),
      this.dateField('Absage-Datum', 'declination_date'),

      this.checkboxField('Zusage erhalten', 'acknowledged_occured'),
      this.checkboxField('Vorstellungsgespräch stattgefunden', 'interview_occured'),
      this.checkboxField('Absage erhalten', 'declination_occured'),

      this.selectField(
        contactTypes,
        'Kontaktart', 
        'contact_type_id', 
        'Kontaktart wählen...',
      ),
      
      this.selectField(
        statusTypes,
        'Status', 
        'status_id', 
        'Status wählen...', 
      ),

      m('button.cursor-pointer', {
        class: 'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300',
        type: 'submit',
      }, 'Bewerbung absenden'),
    ]);
  }
}
