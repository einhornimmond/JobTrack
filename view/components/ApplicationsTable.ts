import m from 'mithril'
import { Application } from '../../model/Application'
import { NavBar } from './NavBar'

interface Attrs {
  last6Months: boolean
}

interface State {
  applications: Application[]
  count: number
}

export class ApplicationsTable implements m.ClassComponent<Attrs> {
  private state: State
  constructor() {
    this.state = { applications: [], count: 0}
  }

  oninit({attrs}: m.CVnode<Attrs>) {
    const url = serverUrl + (attrs.last6Months  ? '/api/applications/last6months' : '/api/applications')
    this.fetchTransactions(url).then((applications: Application[]) => {
      this.state = {  
        applications,
        count: applications.length
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
    return m('tr', [
      m('td', new Date(app.applying_date).toLocaleDateString()),
      m('td', app.employer),
      // m('td', m('a', { href: app.webpage, target: '_blank' }, app.webpage)),
      m('td', app.position),
      m('td', app.contact_person),
      m('td', app.contact_type_id),
      m('td', app.status_id),
      m('td', new Date(app.acknowledgement_date).toLocaleDateString()),
      m('td', new Date(app.interview_date).toLocaleDateString()),
      m('td', new Date(app.declination_date).toLocaleDateString())
    ])
  }

  view() {
    if(this.state.applications) {
      return [
        m(NavBar),
        m('.first-row', 
          m('.oversizing.conti', [
            m('.doma-head', m('legend', `Bewerbungen (${this.state.count})`)),
            m('.doma-content.oversizing', [
              m('a.btn.btn-success',  { href: '/application/add'}, [
                m('i.glyphicon.glyphicon-plus'),
                m('span', ' Neue Bewerbung')
              ]),
              m('.btn.btn-default#print-button', [
                m('i.glyphicon.glyphicon-print'),
                m('span', ' Druckansicht')
              ]),
              m('#applicationTable', [
                m('table', [
                  m('thead', m('tr', [
                    m('th', 'Beworben am'),
                    m('th', 'Arbeitgeber'),
                    m('th', 'Position'),
                    m('th', 'Ansprechpartner'),
                    m('th', 'Kontakt'),
                    m('th', 'Status'),
                    m('th', 'Eingangs- bestätigung'),
                    m('th', 'Vorstellungs- gespräch'),
                    m('th', 'Absage')
                  ])),
                  m('tbody', this.state.applications.map(this.viewApplication))
                ])
              ])
            ])
          ])
        ),
        m('.toaster-wrapper', m(toaster))
      ]
    } else {
      return m('', 'Keine Daten')
    }
  }
}

/*
 var gApplicationMapping = {
            applying_date:"Beworben am",
            employer:"Arbeitgeber",
            webpage:"Webseite",
            position:"Position",
            contact_person:"Ansprechpartner",
            contact_type:"Kontakt",
            status:"Status",
            acknowledge_date:"Eingangs- bestätigung",
            interview_date:"Vorstellungs- gespräch",
            declination_date:"Absage"
        };
    */