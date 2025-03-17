import m from 'mithril'
import { Select, type Option } from './select'

interface Attrs {
}

export class ApplicationForm implements m.ClassComponent<Attrs> {
  application = {
    id: 0,
    applying_date: new Date().toISOString().split('T')[0],  // today's date
    employer: '',
    webpage: '',
    position: '',
    contact_person: '',
    contact_person_gender: '',
    acknowledgement_date: '',
    interview_date: '',
    declination_date: '',
    acknowledged_occured: false,
    interview_occured: false,
    declination_occured: false,
    contact_type_id: 0,
    status_id: 0,
  };

  inputField(label: string, value: string, type: string = 'text', oninput: (e: Event) => void) {
    return m('div', { class: 'mb-4' }, [
      m('label', { class: 'block text-sm font-semibold' }, label),
      m('input', {
        class: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        type: type,
        value: value,
        oninput: oninput,
      })
    ]);
  }

  checkboxField(label: string, checked: boolean, onchange: (e: Event) => void) {
    return m('div', { class: 'mb-4 flex items-center' }, [
      m('input', {
        type: 'checkbox',
        class: 'mr-2',
        checked: checked,
        onchange: onchange,
      }),
      m('label', { class: 'text-sm font-semibold' }, label),
    ]);
  }

  selectField(label: string, options: Option[], selectedValue: number, onchange: (value: number) => void, placeholder?: string, addUrl?: string) {
    return m(Select, {
      label,
      options,
      value: selectedValue,
      onchange,
      placeholder,
      addUrl
    });
  }

  view() {
    return m('form.container.w-3/5.mx-auto.text-stone-200', { class: 'space-y-6' }, [
      this.inputField('Arbeitgeber', this.application.employer, 'text', (e: Event) => { this.application.employer = (e.target as HTMLInputElement).value; }),
      this.inputField('Webseite', this.application.webpage, 'url', (e: Event) => { this.application.webpage = (e.target as HTMLInputElement).value; }),
      this.inputField('Position', this.application.position, 'text', (e: Event) => { this.application.position = (e.target as HTMLInputElement).value; }),
      this.inputField('Kontaktperson', this.application.contact_person, 'text', (e: Event) => { this.application.contact_person = (e.target as HTMLInputElement).value; }),
      this.inputField('Kontaktperson (Geschlecht)', this.application.contact_person_gender, 'text', (e: Event) => { this.application.contact_person_gender = (e.target as HTMLInputElement).value; }),

      this.inputField('Bewerbungsdatum', this.application.applying_date, 'date', (e: Event) => { this.application.applying_date = (e.target as HTMLInputElement).value; }),
      this.inputField('Zusage-Datum', this.application.acknowledgement_date, 'date', (e: Event) => { this.application.acknowledgement_date = (e.target as HTMLInputElement).value; }),
      this.inputField('Vorstellungsgespräch-Datum', this.application.interview_date, 'date', (e: Event) => { this.application.interview_date = (e.target as HTMLInputElement).value; }),
      this.inputField('Absage-Datum', this.application.declination_date, 'date', (e: Event) => { this.application.declination_date = (e.target as HTMLInputElement).value; }),

      this.checkboxField('Zusage erhalten', this.application.acknowledged_occured, (e: Event) => { this.application.acknowledged_occured = (e.target as HTMLInputElement).checked; }),
      this.checkboxField('Vorstellungsgespräch stattgefunden', this.application.interview_occured, (e: Event) => { this.application.interview_occured = (e.target as HTMLInputElement).checked; }),
      this.checkboxField('Absage erhalten', this.application.declination_occured, (e: Event) => { this.application.declination_occured = (e.target as HTMLInputElement).checked; }),

      this.selectField('Kontaktart', contactTypes.getOptions(), this.application.contact_type_id, (value: number) => { this.application.contact_type_id = value; }, 'Kontaktart wählen...', '/api/contactType'),
      
      this.selectField('Status', statusTypes.getOptions(), this.application.status_id, (value: number) => { this.application.status_id = value; }, 'Status wählen...', '/api/statusType'),

      m('button.cursor-pointer', {
        class: 'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300',
        type: 'submit',
      }, 'Bewerbung absenden'),
    ]);
  }
}
