import m from 'mithril'
import './app.css'
import { ApplicationsTable } from './components/ApplicationsTable'
import { Toaster } from './components/Toaster'
import { ApplicationForm } from './components/ApplicationForm'
import { Layout } from './components/Layout'

declare global {
    namespace globalThis {
      var toaster: Toaster
      var serverUrl: string
    }
}

window.toaster = new Toaster
window.serverUrl = 'http://localhost:3000'

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
