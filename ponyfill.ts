import { configureSQLiteDB, createIndexedDB } from './lib/shim.ts'
export * from './lib/indexeddb.ts'

configureSQLiteDB({ memory: false })

export const {
  IDBCursor,
  IDBCursorWithValue,
  IDBDatabase,
  IDBFactory,
  IDBIndex,
  IDBKeyRange,
  IDBObjectStore,
  IDBOpenDBRequest,
  IDBRequest,
  IDBTransaction,
  IDBVersionChangeEvent,
  indexedDB
} = createIndexedDB()
