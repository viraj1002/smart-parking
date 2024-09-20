// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const parkingDataCollection = collection(db, "parkingData");

  onSnapshot(parkingDataCollection, (snapshot) => {
    const entries = snapshot.docs.map(doc => doc.data());
    const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;

    if (latestEntry) {
      updateUI(latestEntry);
    } else {
      console.log("No data available.");
    }
  });
});

function updateUI(data) {
  const dataDiv = document.getElementById("data-div");

  if (dataDiv) {
    dataDiv.innerHTML = `
      Vehicle Number: ${data.vehicleNumber}<br>
      Vehicle Type: ${data.vehicleType}<br>
      In Time: ${data.inTime}<br>
      Payment Method: ${data.selectedPaymentOption}<br>
      Slot: ${data.slot}<br><br>
    `;
  } else {
    console.error("data-div element not found.");
  }
}
