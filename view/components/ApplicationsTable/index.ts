import m from 'mithril'
import { type Application, applicationSchema } from '../../../model/Application' 
import { HeaderField } from './HeaderField'
import { ApplicationRow } from './ApplicationRow'
import { parse } from 'valibot'

interface Attrs {
  last6Months: boolean
}

export class ApplicationsTable implements m.ClassComponent<Attrs> {
  private applications: Application[]
  private count: number
  private last6Month: boolean
  constructor() {
    this.applications = []
    this.count = 0
    this.last6Month = false
  }

  oninit({attrs}: m.CVnode<Attrs>) {
    this.last6Month = attrs.last6Months
    this.loadData(attrs.last6Months)
  }

  onupdate({attrs}: m.CVnode<Attrs>) {
    if(this.last6Month !== attrs.last6Months) {
      this.last6Month = attrs.last6Months
      this.loadData(attrs.last6Months)
    }
  }

  loadData(last6Month: boolean) {
    const url = serverUrl + (last6Month ? '/api/applications/last6months' : '/api/applications')
    this.fetchTransactions(url).then((applications: Application[]) => {
      for(const application of applications) {
        this.applications.push(parse(applicationSchema, application))
      }
      this.count = applications.length
      toaster.success(`${this.count} Bewerbungen geladen`)    
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

  view() {
    if(this.applications) {
      return [
        m('.flex.items-center.justify-between', [
          m('h2.text-xl.text-white.mb-4', `Bewerbungen (${this.count})`),
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
              this.applications.map(application => m(ApplicationRow, { application }))
            )
          ])
        ])
      ]
    } else {
      return m('', 'Keine Daten')
    }
  }
}