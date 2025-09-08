import type { BunRequest } from 'bun'
import { listAll, listLast6Month, show, upsert, remove } from '../../repositories/ApplicationRepository'
import * as v from 'valibot'
import { applicationSchema, type Application } from '../../model/Application'

async function upsertRoute(req: BunRequest<'/api/application'>) {
  let application: Application
  try {
    application = v.parse(applicationSchema, await req.json())
  } catch(e) {
    if (e instanceof v.ValiError) {
      const firstIssue = e.issues[0]
      const key = firstIssue.path[0].key
      const message = key + ': ' + firstIssue.message
      return Response.json({ message }, { status: 400 })
    } else { 
      console.log(JSON.stringify(e, null, 2))
      return Response.json({ message: JSON.stringify(e) }, { status: 400 })
    }
  }
  const isUpdate = application.id !== undefined
  const { changes } = upsert(application)

  if (changes === 1) {
    return Response.json(
      { message: `Application ${isUpdate ? 'updated' : 'added'}` },
      { status: 201 }
    )
  } else {
    return Response.json(
      { message: `Failed to ${isUpdate ? 'update' : 'add'} application` },
      { status: 400 }
    )
  }
}

export const applicationRoutes = {
  '/api/applications': {
    GET: () => Response.json(listAll()),
  },
  '/api/applications/last6months': {
    GET: async () => Response.json(listLast6Month())
  },
  '/api/application': {
    POST: upsertRoute,
    PUT: upsertRoute,
  },
  '/api/application/:id': {
    GET(req: BunRequest<'/api/application/:id'>) {
      const id = parseInt(req.params.id)
      const application = show(id)

      if (!application) {
        return Response.json({ message: 'Application not found' }, { status: 404 })
      } else {
        return Response.json(application)
      }
    },

    DELETE(req: BunRequest<'/api/application/:id'>) {
      const id = parseInt(req.params.id)
      const { changes } = remove(id)

      if (changes !== 1) {
        return Response.json({ message: 'Application not found' }, { status: 404 });
      } else {
        return Response.json({ message: 'Application deleted'}, { status: 200 })
      }
    },
  },
}
