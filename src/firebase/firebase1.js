import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFHuYDLOLj6I8nYUtKWXunPsv04hRCyX4",
  authDomain: "clinicpet-9e489.firebaseapp.com",
  projectId: "clinicpet-9e489",
  storageBucket: "clinicpet-9e489.appspot.com",
  messagingSenderId: "419285370023",
  appId: "1:419285370023:web:7e8ce50362f872e949c782"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//ดึงข้อมูลของ request
const fetchRequestData = async () => {
  const colRef = collection(db, "request");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

//ดึงข้อมูลของ appointment
const fetchAppointData = async () => {
  const colRef = collection(db, "appointment");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

//ดึงข้อมูลของ vaccine
const fetchVaccineData = async () => {
  const colRef = collection(db, "vaccine");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

const fetchDoctorData = async () => {
  const colRef = collection(db, "doctor");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

const fetchMemberData = async () => {
  const colRef = collection(db, "member");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

const fetchAdminData = async () => {
  const colRef = collection(db, "admin");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

const fetchTypeData = async () => {
  const colRef = collection(db, "typePet");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export {auth , db, fetchTypeData, fetchRequestData, fetchAppointData,
  fetchVaccineData, fetchDoctorData, fetchMemberData, fetchAdminData };