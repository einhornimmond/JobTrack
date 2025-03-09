import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './assets/style.css'
import './assets/print-preview.css'
import m from 'mithril'

import { ApplicationsTable } from './components/ApplicationsTable'
import { Toaster } from './components/Toaster'
import { ApplicationForm } from './components/ApplicationForm'

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
    onmatch: () => m.route.set('/lastApplications'),
  },
  '/application/add': ApplicationForm,
  '/applications': ApplicationsTable,
  '/lastApplications': {
    render: () => m(ApplicationsTable, { last6Months: true })
  },
})
