import m from 'mithril'
import { type Application } from '../../../model/Application'
import { HeaderField } from './HeaderField'

interface Attrs {
  last6Months: boolean
}

interface State {
  applications: Application[]
  count: number
  last6Month: boolean
}

export class ApplicationsTable implements m.ClassComponent<Attrs> {
  private state: State
  constructor() {
    this.state = { applications: [], count: 0, last6Month: false }
  }

  oninit({attrs}: m.CVnode<Attrs>) {
    this.state.last6Month = attrs.last6Months
    this.loadData(attrs.last6Months)
  }

  onupdate({attrs}: m.CVnode<Attrs>) {
    if(this.state.last6Month !== attrs.last6Months) {
      this.state.last6Month = attrs.last6Months
      this.loadData(attrs.last6Months)
    }
  }

  loadData(last6Month: boolean) {
    const url = serverUrl + (last6Month ? '/api/applications/last6months' : '/api/applications')
    this.fetchTransactions(url).then((applications: Application[]) => {
      this.state = {  
        applications,
        count: applications.length,
        last6Month
      }
      toaster.success(`${this.state.count} Bewerbungen geladen`)    
    }).catch((error) => {
      toaster.error(error.message)
    })
  }

  async fetchTransactions(url: string) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return await response.json()
  }

  viewApplication(app: Application): m.Child {
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
      m('td.pl-2', app.applying_date ? new Date(app.applying_date).toLocaleDateString() : ''),
      m('td', app.employer),
      // m('td', m('a', { href: app.webpage, target: '_blank' }, app.webpage)),
      m('td', app.position),
      m('td', contactPersonWithGender),
      m('td', contactTypes.getNameById(app.contact_type_id)),
      m('td', statusTypes.getNameById(app.status_id)),
      m('td', app.acknowledgement_date ? new Date(app.acknowledgement_date).toLocaleDateString() : ''),
      m('td', app.interview_date ? new Date(app.interview_date).toLocaleDateString() : ''),
      m('td.pr-2', app.declination_date ? new Date(app.declination_date).toLocaleDateString() : '')
    ])
  }

  view() {
    if(this.state.applications) {
      return [
        m('.flex.items-center.justify-between', [
          m('h2.text-xl.text-white.mb-4', `Bewerbungen (${this.state.count})`),
          m(m.route.Link, {
              class: 'button cursor-pointer flex items-center bg-sky-800 hover:bg-sky-900 text-white rounded-lg p-2 m-2 nav-item', 
              href: '/application/add'
            }, 'Neue Bewerbung')
        ]),
        m('.overflow-x-auto.rounded-xl', [
          m('table.w-full.text-white.border-collapse', [
            m('thead.bg-white/30.text-sky-800',
              m('tr', [
                  [
                    'Beworben am',
                    'Arbeitgeber',
                    'Position',
                    'Ansprechpartner',
                    'Kontakt',
                    'Status',
                    'Eingangs- bestätigung',
                    'Vorstellungs- gespräch',
                    'Absage'
                  ].map(label => m(HeaderField, { label }))
              ])
            ),
            m(
              'tbody.bg-white/20.divide-y.divide-white/30.ml-3',
              this.state.applications.map(this.viewApplication)
            )
          ])
        ])
      ]
    } else {
      return m('', 'Keine Daten')
    }
  }
}