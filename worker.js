// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);

// Get a reference to the Firestore database
const db = getFirestore(app);

let currentBikeSlot = 1;
let currentCarSlot = 1;

document.getElementById("vehicle-type").addEventListener("change", function () {
  const vehicleType = document.getElementById("vehicle-type").value;
  const slotField = document.getElementById("slot");
  if (vehicleType === "bike") {
    slotField.value = `B${currentBikeSlot}`;
  } else if (vehicleType === "car") {
    slotField.value = `C${currentCarSlot}`;
  }
});

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const vehicleType = document.getElementById("vehicle-type").value;
  const slotField = document.getElementById("slot");
  slotField.value = vehicleType === "bike" ? `B${currentBikeSlot}` : `C${currentCarSlot}`;

  // Get form data
  const vehicleNumber = document.getElementById("vehicle-number").value;
  const selectedPayment = document.querySelector("input[name='payment-method']:checked");
  const selectedPaymentOption = selectedPayment ? selectedPayment.value : "";

  // Check if the vehicle number already exists
  const vehicleNumberQuery = query(collection(db, "parkingData"), where("vehicleNumber", "==", vehicleNumber));
  const existingEntries = await getDocs(vehicleNumberQuery);

  if (!existingEntries.empty) {
    console.log("Vehicle number already exists. Skipping data storage.");
    return;
  }

  // Get the current time
  const inTime = getCurrentTime();

  // Store data in Firestore
  const parkingDataCollection = collection(db, "parkingData");
  addDoc(parkingDataCollection, {
    vehicleNumber: vehicleNumber,
    vehicleType: vehicleType,
    inTime: inTime,
    slot: slotField.value,
    selectedPaymentOption: selectedPaymentOption,
  })
    .then(() => {
      console.log("Data stored successfully.");
    })
    .catch(error => {
      console.error("Error adding data: ", error);
    });
});

// Function to get the current time in the format HH:mm
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Retrieve the copied vehicle number from local storage
const copiedVehicleNumber = localStorage.getItem("copiedVehicleNumber");

// Set the retrieved vehicle number in the "vehicle-number" input field
if (copiedVehicleNumber) {
  document.getElementById("vehicle-number").value = copiedVehicleNumber;
}
