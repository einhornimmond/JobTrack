import { StatusType, statusTypeTableName } from '../model/StatusType'
import { db } from './db'
import type { Changes } from 'bun:sqlite'

function getApplicationArray(sql: string): StatusType[] {
    return db.query(sql).as(StatusType).all()
}

function listAll(): StatusType[] {
    return getApplicationArray(
        `SELECT * FROM ${statusTypeTableName}`
    )
}

function upsert(statusType: StatusType): Changes {
    if(statusType.id > 0) {
        return update(statusType)
    } else {
        return add(statusType)
    }
}

function add(statusType: StatusType): Changes {
    return db.run(
        `INSERT INTO ${statusTypeTableName} (name) VALUES (?)`, [ statusType.name ]
    )
}

function update(statusType: StatusType): Changes {
    return db.run(
        `UPDATE ${statusTypeTableName} SET name = ?  WHERE id = ?`, [ statusType.name, statusType.id ]
    )
}

export { listAll,  upsert }
