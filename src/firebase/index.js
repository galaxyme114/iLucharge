import * as firebase from 'firebase';

// Optionally import the services that you want to use
// import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB0ddhKTA8ilSdtLJQcBMXoGe73aU3Hcro",
    authDomain: "ilucharge.firebaseapp.com",
    databaseURL: "https://ilucharge-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ilucharge",
    storageBucket: "ilucharge.appspot.com",
    messagingSenderId: "98180635727",
    appId: "1:98180635727:web:30fe6c6455f78fa2965e3a",
    measurementId: "G-CPCQE6N3G7"
};

firebase.initializeApp(firebaseConfig);

export {
    firebase
};