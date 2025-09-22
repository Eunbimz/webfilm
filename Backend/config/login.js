// Import SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA-PhAMc63l6vU0cih6YaOkA6AluHcBqko",
    authDomain: "film-list-16c4d.firebaseapp.com",
    projectId: "film-list-16c4d",
    storageBucket: "film-list-16c4d.appspot.com",
    messagingSenderId: "542066734181",
    appId: "1:542066734181:web:6572ce48abfb08e6a2028c",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Form login
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Firebase Sign In
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Selamat datang, " + user.email);
            // redirect ke home
            window.location.href = "home.html";
        })
        .catch((error) => {
            alert("Gagal masuk, Harap cek kembali akun anda. Sign up jika belum daftar. " );
        });
});
