import type { BunRequest } from 'bun'
import { listAll, upsert } from '../../repositories/StatusTypeRepository'

async function upsertRoute(req: BunRequest<'/api/application'>) {
  const statusType = await req.json()
  const isUpdate = statusType.id > 0
  const { changes, lastInsertRowid } = upsert(statusType)

  if(!isUpdate) {
    statusType.id = lastInsertRowid
  }

  if (changes === 1) {
    return Response.json(
      { 
        message: `Status Type ${isUpdate ? 'updated' : 'added'}`,
        data: statusType 
      },
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