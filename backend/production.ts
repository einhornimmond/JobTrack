import { serve } from 'bun'
import { applicationRoutes } from './routes/application'
import { contactTypeRoutes } from './routes/contactType'
import { statusTypeRoutes } from './routes/statusType'

// Serve a file by buffering it in memory
async function serverFile(path: string): Promise<Response> {
  const file = Bun.file(path)
  return new Response(await file.bytes(), {
    headers: {  
      "Content-Type": file.type,
    },
  })  
}

const server = serve({
  routes: {
    // Serve all other requests as file requests
    '/' : async () => serverFile('./index.html'),
    // api
    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    '/api/*': Response.json({ message: "Not found" }, { status: 404 }),
    ...applicationRoutes,
    ...contactTypeRoutes,
    ...statusTypeRoutes,
    '/*.': async (req) => {
      const url = new URL(req.url)
      const path = `.${url.pathname}`
      try {
        return await serverFile(path)
      } catch (e) {
        return serverFile('./index.html')
      }
    },
  },
  development: false,
})
console.log(`Listening on ${server.url}`)