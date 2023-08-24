import { openDB } from 'idb';

function createObjectStore(db, storeName, indexName) {
  // console.log(`create object store: %c ${storeName}`, 'color: blue');
  const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
  store.createIndex(indexName, indexName);
}

export default async function initDB() {
  // console.log('initDB()');
  const db = await openDB('my_database', 1, {
    upgrade(db) {
      createObjectStore(db, 'stocks_info_tw', 'stock_id');
      createObjectStore(db, 'stocks_info_us', 'stock_id');
    },
  });

  async function storeData(db, data, store) {
    const tx = db.transaction(store, 'readwrite');
    const asyncList = data => data.map(value => tx.store.add(value));
    await Promise.all([...asyncList(data), tx.done]);
  }

  return { db, storeData };
}
