let db;
const openIndexedDBRequest = indexedDB.open("BudgetDB", 1);

openIndexedDBRequest.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore("BudgetStore", {
    autoIncrement: true,
  });
};

openIndexedDBRequest.onsuccess = event => {
  db = event.target.result;
  if (navigator.onLine) {
    checkLocalDBForPendingUpdates();
  }
};

function checkLocalDBForPendingUpdates() {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const objectStore = transaction.objectStore("BudgetStore");
  const getAllLocalRecordsRequest = objectStore.getAll();
  getAllLocalRecordsRequest.onsuccess = () => {
    if (getAllLocalRecordsRequest.result.length > 0) {
      const body = JSON.stringify(getAllLocalRecordsRequest.result);
      updateRemoteDB(body);
    }
  };
}

async function updateRemoteDB(body) {
  try {
    const response = await fetch("/api/transaction/bulk", {
      method: "POST",
      body,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });
    const results = await response.json();
    if (results.length > 0) {
      const transaction = db.transaction(["BudgetStore"], "readwrite");
      const objectStore = transaction.objectStore("BudgetStore");
      objectStore.clear();
    }
  } catch (err) {
    console.log(err);
  }
}

function saveRecord(record) {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const objectStore = transaction.objectStore("BudgetStore");
  objectStore.add(record);
}

window.ononline = checkLocalDBForPendingUpdates;
