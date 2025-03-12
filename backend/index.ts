import { serve } from 'bun'
import view from '../index.html'
import { applicationRoutes } from './routes/application'
import { contactTypeRoutes } from './routes/contactType'
import { statusTypeRoutes } from './routes/statusType'

const server = serve({
  routes: {
    '/*': view,
    // Serve a file by buffering it in memory
    '/favicon.ico': new Response(await Bun.file('./view/favicon.ico').bytes(), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    }),
    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    '/api/*': Response.json({ message: "Not found" }, { status: 404 }),
    ...applicationRoutes,
    ...contactTypeRoutes,
    ...statusTypeRoutes,
  },
  // Enable development mode for:
  // - Detailed error messages
  // - Hot reloading (Bun v1.2.3+ required)
  // seems to not work on windows yet, problems with websockets
  development: false,
})
console.log(`Listening on ${server.url}`)