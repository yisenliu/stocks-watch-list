import { openDB } from 'idb';

function createObjectStore(db, storeName, indexName) {
  // console.log(`create object store: %c ${storeName}`, 'color: blue');
  const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
  store.createIndex(indexName, indexName);
}

export default async function initDB(storeName) {
  console.log({ storeName });
  const db = await openDB('my_database', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log({ oldVersion, newVersion });
      if (oldVersion < 1) {
        createObjectStore(db, 'stocks_info_tw', 'stock_id');
        createObjectStore(db, 'stocks_info_us', 'stock_id');
      } else {
        transaction(storeName).objectStore(storeName);
      }
    },
  });

  async function storeData(db, data, store) {
    const tx = db.transaction(store, 'readwrite');
    const asyncList = data => data.map(value => tx.store.add(value));
    await Promise.all([...asyncList(data), tx.done]);
  }

  return { db, storeData };
}
