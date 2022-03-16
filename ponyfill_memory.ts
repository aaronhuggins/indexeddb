import { configureSQLiteDB, createIndexedDB } from "./lib/shim.ts";
export * from "./lib/indexeddb.ts";

configureSQLiteDB({ memory: true });

const api = createIndexedDB();

export const IDBCursor = api.IDBCursor;
export const IDBCursorWithValue = api.IDBCursorWithValue;
export const IDBDatabase = api.IDBDatabase;
export const IDBFactory = api.IDBFactory;
export const IDBIndex = api.IDBIndex;
export const IDBKeyRange = api.IDBKeyRange;
export const IDBObjectStore = api.IDBObjectStore;
export const IDBOpenDBRequest = api.IDBOpenDBRequest;
export const IDBRequest = api.IDBRequest;
export const IDBTransaction = api.IDBTransaction;
export const IDBVersionChangeEvent = api.IDBVersionChangeEvent;
export const indexedDB = api.indexedDB;
