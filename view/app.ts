import m from 'mithril'
import './app.css'
import { ApplicationsTable } from './components/ApplicationsTable'
import { Toaster } from './components/Toaster'
import { ApplicationForm } from './components/ApplicationForm'
import { Layout } from './components/Layout'
import { StatusTypes, ContactTypes } from './model/SelectableType'

declare global {
    namespace globalThis {
      var toaster: Toaster
      var serverUrl: string
      var statusTypes: StatusTypes
      var contactTypes: ContactTypes
    }
}

window.toaster = new Toaster
window.serverUrl = 'http://localhost:3000'
// load types from db on app start
window.statusTypes = new StatusTypes({
  listAll: `${window.serverUrl}/api/statusTypes`,
  upsert: `${window.serverUrl}/api/statusType`
})
window.contactTypes = new ContactTypes({
  listAll: `${window.serverUrl}/api/contactTypes`,
  upsert: `${window.serverUrl}/api/contactType`
})
Promise.all([
  window.statusTypes.init(),
  window.contactTypes.init()
]).then(() => {
  // redraw after loading
  m.redraw()
})

m.route.prefix = ''

const app = document.getElementById('app')
if(!app) {
  throw new Error('Root element not found')
}

// routes
m.route(app, '/', {
  '/': {
    onmatch: () => m.route.set('lastApplications'),
  },
  '/application/add': {
    render: () => m(Layout, m(ApplicationForm))
  },
  '/applications': {
    render: () => m(Layout, m(ApplicationsTable))
  },
  '/lastApplications': {
    render: () => m(Layout, m(ApplicationsTable, { last6Months: true }))
  },
})
