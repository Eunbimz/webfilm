// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA-PhAMc63l6vU0cih6YaOkA6AluHcBqko",
  authDomain: "film-list-16c4d.firebaseapp.com",
  projectId: "film-list-16c4d",
  storageBucket: "film-list-16c4d.appspot.com",
  messagingSenderId: "542066734181",
  appId: "1:542066734181:web:6572ce48abfb08e6a2028c",
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM
const form = document.getElementById("editFilmForm");
const judulInput = document.getElementById("judul");
const posterInput = document.getElementById("poster");
const nilaiInput = document.getElementById("nilai");
const reviewInput = document.getElementById("review");
const favouriteInput = document.getElementById("favourite");
const logoutBtn = document.getElementById("logoutBtn");

// Ambil filmId dari query string (?id=xxxx)
const params = new URLSearchParams(window.location.search);
const filmId = params.get("id");

if (!filmId) {
  alert("Film tidak ditemukan!");
  window.location.href = "home.html";
}

// Load data film
async function loadFilm(filmId) {
  const filmRef = doc(db, "films", filmId);
  const filmSnap = await getDoc(filmRef);

  if (filmSnap.exists()) {
    const film = filmSnap.data();
    judulInput.value = film.judul || "";
    posterInput.value = film.poster || "";
    nilaiInput.value = film.nilai || 0;
    reviewInput.value = film.review || "";
    favouriteInput.checked = film.favourite || false;
  } else {
    alert("Film tidak ditemukan!");
    window.location.href = "home.html";
  }
}

// Update data film
async function saveFilm(filmId) {
  const filmRef = doc(db, "films", filmId);
  await updateDoc(filmRef, {
    judul: judulInput.value,
    poster: posterInput.value,
    nilai: parseInt(nilaiInput.value) || 0,
    review: reviewInput.value,
    favourite: favouriteInput.checked,
  });
  alert("Film berhasil diperbarui!");
  window.location.href = "home.html";
}

// Auth state
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "signin.html";
    return;
  }
  loadFilm(filmId);
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveFilm(filmId);
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
        hamburger.classList.toggle("active"); // animasi X
    });
});