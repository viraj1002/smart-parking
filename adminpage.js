// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

// Initialize your Firebase app with your own configuration
const firebaseConfig = {
  apiKey: "AIzaSyCInesJO087J-x7s2by9GSowIddmgDwuZk",
  authDomain: "smart-parking-87c15.firebaseapp.com",
  databaseURL: "https://smart-parking-87c15-default-rtdb.firebaseio.com",
  projectId: "smart-parking-87c15",
  storageBucket: "smart-parking-87c15.appspot.com",
  messagingSenderId: "427530993449",
  appId: "1:427530993449:web:793cb322da83f9db90c138"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const filterForm = document.getElementById("filterForm");
const dataBody = document.getElementById("dataBody");

function updateTable(data, index) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${index}</td>
    <td>${data.vehicleNumber}</td>
    <td>${data.slot}</td>
    <td>${data.vehicleType}</td>
    <td>${data.selectedPaymentOption}</td>
    <td>${data.inTime}</td>
  `;

  dataBody.appendChild(newRow);
}

function applyFilters() {
  const vehicleTypeFilter = filterForm.vehicleType.value.toLowerCase();
  const paymentMethodFilter = filterForm.paymentMethod.value.toLowerCase();
  const inTimeSort = filterForm.inTimeSort.checked;

  const parkingDataCollection = collection(db, "parkingData");
  
  onSnapshot(parkingDataCollection, (snapshot) => {
    const data = snapshot.docs.map(doc => doc.data());

    const filteredData = data.filter(entry => {
      const entryVehicleType = entry.vehicleType.toLowerCase();
      const entryPaymentMethod = entry.selectedPaymentOption.toLowerCase();

      return (
        (vehicleTypeFilter === "all" || entryVehicleType === vehicleTypeFilter) &&
        (paymentMethodFilter === "all" || entryPaymentMethod === paymentMethodFilter)
      );
    });

    if (inTimeSort) {
      filteredData.sort((a, b) => a.inTime.localeCompare(b.inTime));
    }

    dataBody.innerHTML = "";

    if (filteredData.length > 0) {
      filteredData.forEach((entry, index) => {
        updateTable(entry, index + 1);
      });
    } else {
      const noDataMessageRow = document.createElement("tr");
      noDataMessageRow.innerHTML = `<td colspan="6">No matching data found.</td>`;
      dataBody.appendChild(noDataMessageRow);
    }
  });
}

filterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});

const clearFiltersButton = document.getElementById("clearFilters");

clearFiltersButton.addEventListener("click", () => {
  filterForm.reset();
  applyFilters();
});
