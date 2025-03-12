import { ContactType, contactTypeTableName } from '../model/ContactType'
import { db } from './db'
import type { Changes } from 'bun:sqlite'

function getApplicationArray(sql: string): ContactType[] {
    return db.query(sql).as(ContactType).all()
}

function listAll(): ContactType[] {
    return getApplicationArray(
        `SELECT * FROM ${contactTypeTableName}`
    )
}

function upsert(contactType: ContactType): Changes {
    if(contactType.id > 0) {
        return update(contactType)
    } else {
        return add(contactType)
    }
}

function add(contactType: ContactType): Changes {
    return db.run(
        `INSERT INTO ${contactTypeTableName} (name) VALUES (?)`, [ contactType.name ]
    )
}

function update(contactType: ContactType): Changes {
    return db.run(
        `UPDATE ${contactTypeTableName} SET name = ?  WHERE id = ?`, [ contactType.name, contactType.id ]
    )
}

export { listAll,  upsert }
