import type { BunRequest } from 'bun'
import { StatusType } from '../../model/StatusType'
import { listAll, upsert } from '../../repositories/StatusTypeRepository'

async function upsertRoute(req: BunRequest<'/api/application'>) {
  const contactType = await req.json()
  const isUpdate = contactType.id > 0
  const { changes } = upsert(contactType)
  
  if (changes === 1) {
    return Response.json(
      { message: `Status Type ${isUpdate ? 'updated' : 'added'}` },
      { status: 201 }
    )  
  } else {
    return Response.json(
      { message: `Failed to ${isUpdate ? 'update' : 'add'} Status Type` },
      { status: 400 }
    )
  }
}

export const statusTypeRoutes = {
  '/api/statusTypes': {
    GET: () => Response.json(listAll()),
  },
  '/api/statusType': {
    POST: upsertRoute,
    PUT: upsertRoute,
  },
}