// deno-lint-ignore-file no-explicit-any
import type {
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
} from "./indexeddb.ts";
import "https://cdn.skypack.dev/regenerator-runtime@0.13.9";
import indexeddbshim from "https://cdn.skypack.dev/indexeddbshim@v9.0.0/dist/indexeddbshim-noninvasive.js";
import {
  configureSQLiteDB,
  openDatabase,
} from "https://deno.land/x/websql@v1.1.0/mod.ts";

export interface IndexedDBApi {
  IDBCursor: IDBCursor;
  IDBCursorWithValue: IDBCursorWithValue;
  IDBDatabase: IDBDatabase;
  IDBFactory: IDBFactory;
  IDBIndex: IDBIndex;
  IDBKeyRange: IDBKeyRange;
  IDBObjectStore: IDBObjectStore;
  IDBOpenDBRequest: IDBOpenDBRequest;
  IDBRequest: IDBRequest;
  IDBTransaction: IDBTransaction;
  IDBVersionChangeEvent: IDBVersionChangeEvent;
  indexedDB: IDBFactory;
}

interface IDBShim extends IndexedDBApi {
  readonly shimIndexedDB: {
    __useShim: () => void;
  };
}

const setGlobalVars = indexeddbshim as (...args: any[]) => IDBShim;

function createIndexedDB(
  makeGlobal = false,
  escapeName = true,
  systemPath?: string,
): IndexedDBApi {
  const kludge = makeGlobal ? null : { shimIndexedDB: {} };
  const idb = setGlobalVars(kludge, {
    avoidAutoShim: !makeGlobal,
    checkOrigin: false,
    win: { openDatabase },
    escapeDatabaseName: escapeName ? undefined : (name: string) => {
      if (name.toLowerCase().endsWith(".sqlite")) return name;
      return name + ".sqlite";
    },
    sysDatabaseBasePath: systemPath,
  });

  if (!makeGlobal) idb.shimIndexedDB.__useShim();

  return {
    IDBCursor: idb.IDBCursor,
    IDBCursorWithValue: idb.IDBCursorWithValue,
    IDBDatabase: idb.IDBDatabase,
    IDBFactory: idb.IDBFactory,
    IDBIndex: idb.IDBIndex,
    IDBKeyRange: idb.IDBKeyRange,
    IDBObjectStore: idb.IDBObjectStore,
    IDBOpenDBRequest: idb.IDBOpenDBRequest,
    IDBRequest: idb.IDBRequest,
    IDBTransaction: idb.IDBTransaction,
    IDBVersionChangeEvent: idb.IDBVersionChangeEvent,
    indexedDB: idb.indexedDB,
  };
}

export { configureSQLiteDB, createIndexedDB };
