// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getFirestore, doc, getDoc, setDoc, updateDoc,
    collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
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

const namaInput = document.getElementById("nama");
const fotoInput = document.getElementById("foto");
const deskripsiInput = document.getElementById("deskripsi");
const form = document.getElementById("userForm");

// Load profil user
async function loadUser(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();    
        namaInput.value = data.nama || "";
        fotoInput.value = data.foto || "";
        deskripsiInput.value = data.deskripsi || "";
    }
}

// Update profil user
async function saveUser(userId) {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
        userId: userId,
        nama: namaInput.value,
        foto: fotoInput.value,
        deskripsi: deskripsiInput.value
    }, { merge: true });
    alert("Profil berhasil diperbarui!");
}

// Jalankan ketika user login
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "signin.html";
        return;
    }

    loadUser(user.uid);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        saveUser(user.uid);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
        hamburger.classList.toggle("active"); // animasi X
    });
});