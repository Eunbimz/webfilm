// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getFirestore, doc, getDoc, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Config Firebase
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

// DOM element
const fotoEl = document.getElementById("userFoto");
const namaEl = document.getElementById("userNama");
const deskripsiEl = document.getElementById("userDeskripsi");
const favSection = document.getElementById("favouriteFilms");
const logoutBtn = document.getElementById("logoutBtn");

// Load profil user
async function loadUser(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        fotoEl.src = data.foto && data.foto.trim() !== ""
            ? data.foto
            : "https://via.placeholder.com/120x160";
        namaEl.textContent = data.nama || "Tanpa Nama";
        deskripsiEl.textContent = data.deskripsi || "Belum ada deskripsi.";
    } else {
        fotoEl.src = "https://via.placeholder.com/120x160";
        namaEl.textContent = "Tanpa Nama";
        deskripsiEl.textContent = "Belum ada deskripsi.";
    }
}

// Fungsi untuk memotong teks
function truncate(text, maxLength = 80) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// Load film favorit
async function loadFavouriteFilms(userId) {
    favSection.innerHTML = ""; // reset
    const filmsRef = collection(db, "films");
    const q = query(filmsRef, where("favourite", "==", true), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        favSection.innerHTML = "<p>Belum ada film favorit</p>";
        return;
    }

    querySnapshot.forEach((docSnap) => {
        const film = docSnap.data();
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <img src="${film.poster}" alt="${film.judul}" class="film-poster" />
      <h3>${film.judul}</h3>
      <p class="rating">${"⭐".repeat(film.nilai)}${"☆".repeat(10 - film.nilai)}</p>
      <p class="note">${truncate(film.review, 80)}</p>
    `;
        favSection.appendChild(card);
    });
}

// Auth state
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "signin.html";
        return;
    }
    loadUser(user.uid);
    loadFavouriteFilms(user.uid);
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