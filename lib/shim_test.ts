// deno-lint-ignore-file
import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts'
import { configureSQLiteDB, createIndexedDB } from './shim.ts'
import type { IDBFactory, IDBOpenDBRequest } from './indexeddb.ts'

Deno.test('createIndexedDB', async ({ step }) => {
  configureSQLiteDB({ memory: true })
  let idb: IDBFactory
  let open: IDBOpenDBRequest

  await step('should return IDBFactory', () => {
    idb = createIndexedDB()

    assertEquals(typeof idb.open, 'function')
  })

  await step('should add indexedDB to the global scope', () => {
    createIndexedDB(true)
    open = (globalThis as any).indexedDB

    assertEquals(typeof (globalThis as any).indexedDB, 'object')
    assertEquals(typeof (globalThis as any).indexedDB.open, 'function')
  })

  await step('should create a schema', async () => {
    await new Promise<void>((resolve, reject) => {
      open = idb.open("MyDatabase", 1)
      open.onerror = (error) => reject((error as any).debug)
      open.onupgradeneeded = () => {
        try {
          const db = open.result
          const store = db.createObjectStore("MyObjectStore", { keyPath: "id" })
          store.createIndex("NameIndex", ["name.last", "name.first"])
          resolve()
        } catch (error) {
          reject(error)
        }
      }
    })
    await new Promise<void>((resolve, reject) => {
      open.onsuccess = () => {
        // Start a new transaction
        const db = open.result
        const tx = db.transaction("MyObjectStore", "readwrite");
        tx.onerror = (error) => reject((error as any).debug)

        const store = tx.objectStore("MyObjectStore");

        store.put({id: 12345, name: { first: "John", last: "Doe" }, age: 42});

        const getJohn = store.get(12345);
        getJohn.onerror = (error) => reject((error as any).debug)

        getJohn.onsuccess = () => {
          assertEquals(getJohn.result.name.first, 'John');
        };

        tx.oncomplete = () => {
            db.close();
            resolve()
        };
      }
    })
  })

  await step('should create a schema', async () => {})
})
