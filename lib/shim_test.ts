// deno-lint-ignore-file
import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { configureSQLiteDB, createIndexedDB } from "./shim.ts";
import type { IDBFactory, IDBOpenDBRequest } from "./indexeddb.ts";

const write = await Deno.permissions.query({ name: "write" })
const read = await Deno.permissions.query({ name: "read" })
const useMemory = write.state !== "granted" && read.state !== "granted"

Deno.test("createIndexedDB", async ({ step }) => {
  configureSQLiteDB({ memory: useMemory });
  let idb: IDBFactory;
  let open: IDBOpenDBRequest;

  await step("should return IDBFactory", () => {
    const { indexedDB } = createIndexedDB();
    idb = indexedDB;

    assertEquals(typeof indexedDB.open, "function");
  });

  await step("should add indexedDB to the global scope", () => {
    createIndexedDB(true);
    open = (globalThis as any).indexedDB;

    assertEquals(typeof (globalThis as any).indexedDB, "object");
    assertEquals(typeof (globalThis as any).indexedDB.open, "function");
  });

  await step("should create a schema", async () => {
    return await new Promise<void>((resolve, reject) => {
      open = idb.open("MyDatabase", 1);
      open.onerror = (error) => reject((error as any).debug);
      open.onupgradeneeded = () => {
        try {
          const db = open.result;
          const store = db.createObjectStore("MyObjectStore", {
            keyPath: "id",
          });
          store.createIndex("NameIndex", ["name.last", "name.first"]);
        } catch (error) {
          reject(error);
        }
      };
      open.onsuccess = () => {
        // Start a new transaction
        const db = open.result;
        const tx = db.transaction("MyObjectStore", "readwrite");
        tx.onerror = (error) => reject((error as any).debug);

        const store = tx.objectStore("MyObjectStore");

        store.put({ id: 12345, name: { first: "John", last: "Doe" }, age: 42 });

        const getJohn = store.get(12345);
        getJohn.onerror = (error) => reject((error as any).debug);

        getJohn.onsuccess = () => {
          assertEquals(getJohn.result.name.first, "John");
        };

        tx.oncomplete = () => {
          db.close();
          dispatchEvent(new Event("unload"))
          clearAllTimeouts().then(() => resolve())
        };
      };
    });
  });
});

/** Hack for closing leaky async resources that are ignored by the IndexedDB implementation expecting to be long-lived. */
async function clearAllTimeouts () {
  return await new Promise<void>(resolve => {
    let id = setTimeout(() => {
      while (id--) {
        clearTimeout(id)
      }
      resolve()
    })
  })
}
