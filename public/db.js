let db;
const openIndexedDBRequest = indexedDB.open("BudgetDB", 1);

openIndexedDBRequest.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore("BudgetStore", {
    autoIncrement: true,
  });
};
