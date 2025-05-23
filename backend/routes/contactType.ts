import type { BunRequest } from 'bun'
import { listAll, upsert } from '../../repositories/ContactTypeRepository'

async function upsertRoute(req: BunRequest<'/api/application'>) {
  const contactType = await req.json()
  const isUpdate = contactType.id > 0
  const { changes, lastInsertRowid } = upsert(contactType)
  if (!isUpdate) {
    contactType.id = lastInsertRowid
  }

  if (changes === 1) {
    return Response.json(
      { 
        message: `Contact Type ${isUpdate ? 'updated' : 'added'}`,
        data: contactType
      },
      { status: 201 }
    )
  } else {
    return Response.json(
      { message: `Failed to ${isUpdate ? 'update' : 'add'} Contact Type` },
      { status: 400 }
    )
  }
}

export const contactTypeRoutes = {
  '/api/contactTypes': {
    GET: () => Response.json(listAll()),
  },
  '/api/contactType': {
    POST: upsertRoute,
    PUT: upsertRoute,
  },
}