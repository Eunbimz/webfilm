import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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

// Form
const filmForm = document.getElementById("filmForm");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("Silahkan login terlebih dahulu!");
        window.location.href = "signin.html";
        return;
    }

    filmForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const judul = document.getElementById("judul").value.trim();
        const posterURL = document.getElementById("poster").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const nilai = document.getElementById("nilai").value;
        const review = document.getElementById("review").value.trim();
        const favourite = document.getElementById("favourite").checked;

        try {
            await addDoc(collection(db, "films"), {
                userId: user.uid,
                judul,
                poster: posterURL,
                genre,
                nilai: Number(nilai),
                review,
                favourite,
                createdAt: serverTimestamp(),
            });

            alert("Film berhasil disimpan!");
            filmForm.reset();
        } catch (err) {
            console.error("Error simpan film:", err);
            alert("Gagal menyimpan film: " + err.message);
        }
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