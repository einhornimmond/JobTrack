import m from 'mithril'
import { Select, type Option, type Attrs as SelectAttrs } from './select'
import { applicationSchema, type ApplicationInput } from '../../model/Application'
import { SelectableType } from '../model/SelectableType'
import * as v from 'valibot'

interface Attrs {
  
}

export class ApplicationForm implements m.ClassComponent<Attrs> {
  private application: any

  constructor() {
    this.application = {
      applying_date: new Date().toISOString().split('T')[0],
      contact_type_id: 1,
      status_id: 1,
    }
  }

  inputField(label: string, fieldName: keyof ApplicationInput, type: string = 'text', oninput: (e: Event) => void) {
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

  textField(label: string, fieldName: keyof ApplicationInput, type: string = 'text') {
    return this.inputField(label, fieldName, type, (e: Event) => {
      const input = e.target as HTMLInputElement
      this.application[fieldName] = input.value; 
    })
  }

  dateField(label: string, fieldName: keyof ApplicationInput) {
    return this.inputField(label, fieldName, 'date', (e: Event) => {
      const input = e.target as HTMLInputElement
      this.application[fieldName] = input.value; 
    })
  }

  checkboxField(label: string, fieldName: keyof ApplicationInput){
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

  selectField<T extends Option>(selectableType: SelectableType<T>, label: string, fieldName: keyof ApplicationInput, placeholder?: string, addUrl?: string) {
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
    // console.log(this.application)
    return m('form.container.w-3/5.mx-auto.text-stone-200', { class: 'space-y-6' }, [
      this.textField('Arbeitgeber', 'employer'),
      this.textField('Webseite', 'webpage', 'url'),
      this.textField('Position', 'position'),
      this.textField('Kontaktperson', 'contact_person'),
      this.textField('Kontaktperson (Geschlecht)', 'contact_person_gender'),

      this.dateField('Bewerbungsdatum', 'applying_date'),
      // this.dateField('Zusage-Datum', 'acknowledgement_date'),
      // this.dateField('Vorstellungsgespräch-Datum', 'interview_date'),
      // this.dateField('Absage-Datum', 'declination_date'),

      // this.checkboxField('Zusage erhalten', 'acknowledged_occured'),
      // this.checkboxField('Vorstellungsgespräch stattgefunden', 'interview_occured'),
      // this.checkboxField('Absage erhalten', 'declination_occured'),

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
        onclick: (e: Event) => {
          e.preventDefault()
          try {
            const application = v.parse(applicationSchema, this.application, { abortEarly: true })
            // console.log(application)
            m.request({
              method: 'POST',
              url: '/api/application',
              body: application,
            })
            .then(() => {
              toaster.success('Bewerbung erfolgreich gespeichert')
              m.route.set('/lastApplications')
            })
            .catch((error) => {
              toaster.error(error.message)
            })
          } catch (error: any) {
            if (error instanceof v.ValiError) {
              toaster.error(error.message)
            } else {
              const errorStr = JSON.stringify(error, null, 2)
              toaster.error(errorStr)
              console.log(errorStr)
            }
          }
        }
      }, 'Bewerbung absenden'),
    ]);
  }
}
