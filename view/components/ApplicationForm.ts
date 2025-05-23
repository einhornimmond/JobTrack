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

  inputField(label: string, fieldName: StringField | DateField, type: string = 'text') {
    return m('div', { class: 'mb-4' }, [
      m('label', { class: 'block text-sm font-semibold' }, label),
      m('input', {
        class: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        type: type,
        value: this.application[fieldName],
        oninput: this.updateValue(fieldName),
      })
    ]);
  }

  checkboxField(label: string, fieldName: BooleanField){
    return m('div', { class: 'mb-4 flex items-center' }, [
      m('input', {
        type: 'checkbox',
        class: 'mr-2',
        checked: this.application[fieldName],
        onchange: this.updateValue(fieldName),
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

  updateValue(fieldName: StringField | BooleanField | DateField | NumberField): (e: Event) => void {
    return (e: Event) => { 
      const htmlInput = e.target as HTMLInputElement
      if (<StringField>fieldName) {
        this.application[fieldName as StringField] = htmlInput.value; 
      } else if(<BooleanField>fieldName) {
        this.application[fieldName as BooleanField] = htmlInput.checked; 
      } else if(<NumberField>fieldName) {
        this.application[fieldName as NumberField] = Number(htmlInput.value); 
      } else if(<DateField>fieldName) {
        this.application[fieldName as DateField] = new Date(htmlInput.value); 
      }
    }
  }

  view() {
    return m('form.container.w-3/5.mx-auto.text-stone-200', { class: 'space-y-6' }, [
      this.inputField('Arbeitgeber', 'employer', 'employer'),
      this.inputField('Webseite', 'webpage', 'url'),
      this.inputField('Position', 'position', 'text'),
      this.inputField('Kontaktperson', 'contact_person', 'text'),
      this.inputField('Kontaktperson (Geschlecht)', 'contact_person_gender', 'text'),

      this.inputField('Bewerbungsdatum', 'applying_date', 'date'),
      this.inputField('Zusage-Datum', 'acknowledgement_date', 'date'),
      this.inputField('Vorstellungsgespräch-Datum', 'interview_date', 'date'),
      this.inputField('Absage-Datum', 'declination_date', 'date'),

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
