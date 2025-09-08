import m from 'mithril'
import { Select, type Option, type Attrs as SelectAttrs } from '../select'
import { type Application } from '../../../model/Application'

interface Attrs {
    application: Application
}
  
export class ApplicationRow implements m.ClassComponent<Attrs> {
    private statusTypeEditMode: boolean
    private application: Application | undefined
    constructor() {
        this.statusTypeEditMode = false        
    }

    oninit({attrs}: m.CVnode<Attrs>) {
        this.application = attrs.application
    }

    private updateStatus(newValue: number, attrs: Attrs) {
        if (!this.application) {
            throw new Error('Application is undefined')
        }
        this.application.status_id = newValue
        
        // 2 => Eingang bestätigt
        if (newValue === 2) {
            this.application.acknowledgement_date = new Date()
            this.application.acknowledged_occured = true
        }

        // 3 => Absage erhalten, 9 => abgesagt
        // TODO: make as enum
        if (newValue === 3 || newValue === 9) {
            this.application.declination_date = new Date()
            this.application.declination_occured = true
        }
        this.statusTypeEditMode = false

        fetch(serverUrl + '/api/application', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.application),
        }).then(async (response) => {
            const json = await response.json()
            if(response.ok) {
                toaster.success(json.message)
            } else {
                toaster.error(json.message)
            }
        }).catch((error) => {
            toaster.error(error.message)
        })
    }

    private viewStatusType(attrs: Attrs): m.Child {
        if (!this.application) {
            throw new Error('Application is undefined')
        }
        return this.statusTypeEditMode ? 
            m(Select,
                { 
                    selectableType: statusTypes,
                    value: this.application.status_id,
                    onchange: (e: number) => this.updateStatus(e, attrs),
                    label: 'Status',
                    placeholder: 'Status wählen...',
                } as SelectAttrs<Option>
            ) : m(
                'span.cursor-pointer', 
                { onclick: () => this.statusTypeEditMode = !this.statusTypeEditMode },
                statusTypes.getNameById(this.application.status_id)
            )
    }

    view({attrs}: m.CVnode<Attrs>) {
        if (!this.application) {
            throw new Error('Application is undefined')
        } 
        const app = this.application
        let contactPersonWithGender = app.contact_person
        if (app.contact_person && app.contact_person !== '-') {
            if (app.contact_person_gender === 'm') {
            contactPersonWithGender = 'Herr '
            } else if (app.contact_person_gender === 'w') {
            contactPersonWithGender = 'Frau '
            }
            contactPersonWithGender += app.contact_person
        }
        return m('tr.hover:bg-blue-300.hover:text-stone-950', { key: app.id }, [
            m('td.pl-2', app.applying_date ? app.applying_date.toLocaleDateString() : ''),
            //m('td', app.employer),
            m('td', m('a', { href: app.webpage, target: '_blank' }, app.employer)),
            m('td', app.position),
            m('td', contactPersonWithGender),
            m('td', contactTypes.getNameById(app.contact_type_id)),
            m('td', this.viewStatusType(attrs)),
            m('td', app.acknowledgement_date ? app.acknowledgement_date.toLocaleDateString() : ''),
            m('td', app.interview_date ? app.interview_date.toLocaleDateString() : ''),
            m('td.pr-2', app.declination_date ? app.declination_date.toLocaleDateString() : '')
        ])
    }
}