import m from 'mithril'
import { Application } from '../../model/Application'
import { NavBar } from './nav/NavBar'

interface Attrs {
    id?: number | null | undefined
}

export class ApplicationForm implements m.ClassComponent<Attrs> {
    submit(e: Event): void {
        e.preventDefault()
        console.log('submit: ', e)
    }

    view() {
       return [
               m(NavBar),
               m('.first-row', 
                 m('.oversizing.conti', [
                   m('.doma-head', m('legend', 'Neue Bewerbung')),
                   m('.doma-content.oversizing', 
                     m('form#applicationForm', {onsubmit: this.submit}, [
                        m('.mt-2', [
                            m('label.me-4', {for: 'applyingDate'}, 'Beworben am:'),
                            m('input#applyingDate', { type: 'date', name: 'applying_date' }),
                        ]),
                        m('.mt-2', [
                            m('label.me-4', {for: 'employer'}, 'Arbeitgeber: '),
                            m('input#employer', { type: 'text', name: 'employer' })
                        ]),
                        m('input.mt-2', { type: 'submit', value: 'Speichern' })
                     ])
                   )
                 ])
               )
       ]
    }
}

/*id: number
    applying_date: Date
    employer: string
    webpage: string
    position: string
    contact_person: string
    contact_person_gender: string
    acknowledgement_date: Date
    interview_date: Date
    declination_date: Date
    acknowledged_occured: boolean
    interview_occured: boolean
    declination_occured: boolean
    contact_type_id: number
    status_id: number
    */