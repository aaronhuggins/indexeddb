// deno-lint-ignore-file no-explicit-any
import type {
  IDBCursor,
  IDBCursorWithValue,
  IDBFactory,
  IDBDatabase,
  IDBIndex,
  IDBKeyRange,
  IDBObjectStore,
  IDBOpenDBRequest,
  IDBRequest,
  IDBTransaction,
  IDBVersionChangeEvent
} from './indexeddb.ts'
import 'https://cdn.skypack.dev/regenerator-runtime@0.13.9'
import indexeddbshim from 'https://cdn.skypack.dev/indexeddbshim@v9.0.0/dist/indexeddbshim-noninvasive.js'
import { openDatabase, configureSQLiteDB } from 'https://deno.land/x/websql@v1.1.0/mod.ts'

export interface IndexedDBApi {
  IDBCursor: IDBCursor
  IDBCursorWithValue: IDBCursorWithValue
  IDBDatabase: IDBDatabase
  IDBFactory: IDBFactory
  IDBIndex: IDBIndex
  IDBKeyRange: IDBKeyRange
  IDBObjectStore: IDBObjectStore
  IDBOpenDBRequest: IDBOpenDBRequest
  IDBRequest: IDBRequest
  IDBTransaction: IDBTransaction
  IDBVersionChangeEvent: IDBVersionChangeEvent
  indexedDB: IDBFactory
}

interface IDBShim extends IndexedDBApi {
  readonly shimIndexedDB: {
    __useShim: () => void
  }
}

const setGlobalVars = indexeddbshim as (...args: any[]) => IDBShim
const indexedDBApi: Array<keyof IndexedDBApi> = [
  "IDBCursor",
  "IDBCursorWithValue",
  "IDBDatabase",
  "IDBFactory",
  "IDBIndex",
  "IDBKeyRange",
  "IDBObjectStore",
  "IDBOpenDBRequest",
  "IDBRequest",
  "IDBTransaction",
  "IDBVersionChangeEvent",
  "indexedDB"
]

function createIndexedDB (makeGlobal = false): IndexedDBApi {
  const kludge = makeGlobal ? null : { shimIndexedDB: {} }
  const idb = setGlobalVars(kludge, {
    avoidAutoShim: !makeGlobal,
    checkOrigin: false,
    win: { openDatabase }
  })

  if (!makeGlobal) idb.shimIndexedDB.__useShim()

  const api: IndexedDBApi = {} as any

  for (const apiName of indexedDBApi) {
    api[apiName] = idb[apiName] as any
  }

  return api
}

export {
  createIndexedDB,
  configureSQLiteDB
}
