import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
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

const filmGrid = document.getElementById("filmGrid");
const logoutBtn = document.getElementById("logoutBtn");

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "signin.html";
});

// Fungsi untuk memotong teks
function truncate(text, maxLength = 80) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// Cek user
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "signin.html";
        return;
    }

    try {
        // Query film berdasarkan userId
        const q = query(collection(db, "films"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            filmGrid.innerHTML = "<p>Belum ada film, tambah dulu!</p>";
            return;
        }

        filmGrid.innerHTML = ""; // kosongin dulu

        querySnapshot.forEach((docSnap) => {
            const film = docSnap.data();

            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
      <img src="${film.poster}" alt="${film.judul}" class="film-poster" />
      <h3>${film.judul}</h3>
      <p class="rating">⭐ ${film.nilai}/10</p>
      <p class="note">${truncate(film.review, 80)}</p>

      <a href="update.html?id=${docSnap.id}" class="edit-btn">✏️ Edit Film</a>
      <button class="delete-btn">🗑️ Hapus Film</button>
    `;
            filmGrid.appendChild(card);

            // Tombol delete
            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", async () => {
                const konfirmasi = confirm(`Yakin mau hapus film "${film.judul}"?`);
                if (!konfirmasi) return;

                try {
                    await deleteDoc(doc(db, "films", docSnap.id));
                    alert("Film berhasil dihapus!");
                    card.remove(); // hapus dari UI
                } catch (err) {
                    console.error(err);
                    alert("Gagal menghapus film.");
                }
            });
        });

    } catch (err) {
        console.error(err);
        filmGrid.innerHTML = "<p>Gagal memuat film.</p>";
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
        hamburger.classList.toggle("active"); // animasi X
    });
});