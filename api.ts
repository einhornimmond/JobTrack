import { serve } from 'bun'
import { ApplicationController } from './model/applications'

const appController = new ApplicationController();

serve({
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    if (path === "/applications" && method === "GET") {
      const applications = await appController.indexAction()
      return new Response(JSON.stringify(applications), { status: 200 })
    }

    if (path === "/applications/last6months" && method === "GET") {
      const applications = await appController.last6MonthAction()
      return new Response(JSON.stringify(applications), { status: 200 })
    }

    if (path === "/application" && method === "POST") {
      const application = await req.json()
      await appController.addAction(application)
      return new Response("Application added", { status: 201 })
    }

    if (path.startsWith("/application/") && method === "PUT") {
      const id = parseInt(path.split("/")[2])
      const updatedApplication = await req.json()
      updatedApplication.id = id
      await appController.editAction(updatedApplication)
      return new Response("Application updated", { status: 200 })
    }

    if (path.startsWith("/application/") && method === "DELETE") {
      const id = parseInt(path.split("/")[2])
      await appController.deleteAction(id)
      return new Response("Application deleted", { status: 200 })
    }

    return new Response("Not Found", { status: 404 })
  },
})