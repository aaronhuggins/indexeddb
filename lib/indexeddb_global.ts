// deno-lint-ignore-file no-empty-interface
import type {
  IDBCursor as IDBCursor1,
  IDBCursorWithValue as IDBCursorWithValue1,
  IDBDatabase as IDBDatabase1,
  IDBFactory as IDBFactory1,
  IDBIndex as IDBIndex1,
  IDBKeyRange as IDBKeyRange1,
  IDBObjectStore as IDBObjectStore1,
  IDBOpenDBRequest as IDBOpenDBRequest1,
  IDBRequest as IDBRequest1,
  IDBTransaction as IDBTransaction1,
  IDBVersionChangeEvent as IDBVersionChangeEvent1
} from './indexeddb.ts'

declare global {
  interface IDBCursor extends IDBCursor1 {}
  interface IDBCursorWithValue extends IDBCursorWithValue1 {}
  interface IDBDatabase extends IDBDatabase1 {}
  interface IDBFactory extends IDBFactory1 {}
  interface IDBIndex extends IDBIndex1 {}
  interface IDBKeyRange extends IDBKeyRange1 {}
  interface IDBObjectStore extends IDBObjectStore1 {}
  interface IDBOpenDBRequest extends IDBOpenDBRequest1 {}
  interface IDBRequest extends IDBRequest1 {}
  interface IDBTransaction extends IDBTransaction1 {}
  interface IDBVersionChangeEvent extends IDBVersionChangeEvent1 {}

  interface WindowOrWorkerGlobalScope {
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

  let indexedDB: IDBFactory
}
