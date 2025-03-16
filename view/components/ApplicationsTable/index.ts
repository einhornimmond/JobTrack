import m from 'mithril'
import { Application } from '../../../model/Application'
import { HeaderField } from './HeaderField'
import { Icon } from '../Icon'

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
      return m('tr.hover:bg-blue-300.hover:text-stone-950', { key: app.id }, [
        m('td.pl-2', new Date(app.applying_date).toLocaleDateString()),
        m('td', app.employer),
        // m('td', m('a', { href: app.webpage, target: '_blank' }, app.webpage)),
        m('td', app.position),
        m('td', app.contact_person),
        m('td', contactTypes.getNameById(app.contact_type_id)),
        m('td', statusTypes.getNameById(app.status_id)),
        m('td', new Date(app.acknowledgement_date).toLocaleDateString()),
        m('td', new Date(app.interview_date).toLocaleDateString()),
        m('td.pr-2', new Date(app.declination_date).toLocaleDateString())
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
            }, m(Icon, { icon: 'plus', iconSet: 'mdi'}), 'Neue Bewerbung')
        ]),
        m('.overflow-x-auto.rounded-xl', [
          m('table.w-full.text-white.border-collapse', [
            m('thead.bg-white/30.text-sky-800',
              m('tr', [
                  m(HeaderField, { label: 'Beworben am' }),
                  m(HeaderField, { label: 'Arbeitgeber' }),
                  m(HeaderField, { label: 'Position' }),
                  m(HeaderField, { label: 'Ansprechpartner' }),
                  m(HeaderField, { label: 'Kontakt', className: 'w-3xs' }),
                  m(HeaderField, { label: 'Status' }),
                  m(HeaderField, { label: 'Eingangs- bestätigung' }),
                  m(HeaderField, { label: 'Vorstellungs- gespräch' }),
                  m(HeaderField, { label: 'Absage' })
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