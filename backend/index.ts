import { ApplicationController } from '../controller/ApplicationController'
import { serve } from 'bun'
import view from '../index.html'

const appController = new ApplicationController();

const server = serve({
  routes: {
    '/*': view,
    // Serve a file by buffering it in memory
    '/favicon.ico': new Response(await Bun.file('./view/assets/favicon.ico').bytes(), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    }),
    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    '/api/*': Response.json({ message: "Not found" }, { status: 404 }),
    '/api/applications': {
      async GET() {
        const applications = await appController.indexAction()
        return Response.json(applications)
      },
    },
    '/api/applications/last6months': async () => {
      const applications = await appController.last6MonthAction()
      return Response.json(applications)
    },
    '/api/application': {
      async POST(req) {
        const application = await req.json()
        await appController.addAction(application)
        return Response.json({ message: 'Application added'}, { status: 201 })
      },
    },
    '/api/application/:id': {
      async GET(req) {
        const id = parseInt(req.params.id)
        const application = await appController.showAction(id)
        return Response.json(application)
      },
      async PUT(req) {
        const id = parseInt(req.params.id)
        const updatedApplication = await req.json()
        updatedApplication.id = id
        await appController.editAction(updatedApplication)
        return Response.json({ message: 'Application updated'}, { status: 200 })
      },
      async DELETE(req) {
        const id = parseInt(req.params.id)
        await appController.deleteAction(id)
        return Response.json({ message: 'Application deleted'}, { status: 200 })
      },
    },  

  },
  // Enable development mode for:
  // - Detailed error messages
  // - Hot reloading (Bun v1.2.3+ required)
  development: false,
})
console.log(`Listening on ${server.url}`)