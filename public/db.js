let db;

navigator.serviceWorker.oncontrollerchange = start;
if (navigator.serviceWorker.ready) {
  start();
}

function start() {
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

  window.ononline = checkLocalDBForPendingUpdates;
}

function checkLocalDBForPendingUpdates() {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const objectStore = transaction.objectStore("BudgetStore");
  const getAllLocalRecordsRequest = objectStore.getAll();
  getAllLocalRecordsRequest.onsuccess = async () => {
    if (getAllLocalRecordsRequest.result.length > 0) {
      const body = JSON.stringify(getAllLocalRecordsRequest.result);
      await updateRemoteDB(body);
    }
    return getRemoteTransactionsAndDisplay();
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
