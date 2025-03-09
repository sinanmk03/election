import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXGz-Q1xg4x2F3NhocOB0_RNsrJOLwUYs",
  authDomain: "voting-system-468bf.firebaseapp.com",
  projectId: "secure-voting-system",
  storageBucket: "secure-voting-system.appspot.com",
  messagingSenderId: "415598780631",
  appId: "1:415598780631:web:e16ec4b78af1ca53811092",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const registrationForm = document.getElementById("registration-form");
const loginForm = document.getElementById("login-form");

const loadingWidget = document.getElementById("loading");

function showLoading() {
  if (loadingWidget) loadingWidget.style.display = "flex";
}

function hideLoading() {
  if (loadingWidget) loadingWidget.style.display = "none";
}

if (registrationForm) {
  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const voterID = (document.getElementById("voterID") as HTMLInputElement)?.value.trim();
    const voterName = (document.getElementById("name") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("password") as HTMLInputElement)?.value.trim();
    const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement)?.value.trim();
    const idError = document.getElementById("idError");
    const nameError = document.getElementById("nameError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const regMsg = document.getElementById("regMsg");

    [idError, nameError, passwordError, confirmPasswordError].forEach(
      (element) => {
        if (element) element.textContent = "";
      }
    );

    ["voterID", "name", "password", "confirmPassword"].forEach((fieldId) => {
      const fieldElement = document.getElementById(fieldId) as HTMLInputElement;
      if (fieldElement) fieldElement.style.borderColor = "";
    });

    if (voterName === "") {
      const nameElement = document.getElementById("name") as HTMLInputElement;
      if (nameElement) nameElement.style.borderColor = "red";
      return;
    } else if (voterID === "") {
      const voterIDElement = document.getElementById("voterID") as HTMLInputElement;
      if (voterIDElement) voterIDElement.style.borderColor = "red";
      return;
    } else if (isNaN(Number(voterID))) {
      const voterIDElement = document.getElementById("voterID") as HTMLInputElement;
      if (voterIDElement) voterIDElement.style.borderColor = "red";
      if (idError) idError.textContent = "VoterID only contains numbers";
      return;
    } else if (voterID.length !== 10) {
      const voterIDElement = document.getElementById("voterID") as HTMLInputElement;
      if (voterIDElement) voterIDElement.style.borderColor = "red";
      if (idError) idError.textContent = "Voter ID should be 10 digits";
      return;
    }

    const passwordElement = document.getElementById("password") as HTMLInputElement;
    if (passwordElement) passwordElement.style.borderColor = "red";
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;
    if (password === "") {
      if (passwordError) passwordError.textContent = "You must fill this field";
      return;
    } else if (!strongPassword.test(password)) {
      if (passwordError) passwordError.textContent = "Password must be at least 6 characters long and include a number, a letter, and a special character";
      return;
    }

    if (confirmPassword === "") {
      const confirmPasswordElement = document.getElementById("confirmPassword") as HTMLInputElement;
      if (confirmPasswordElement) confirmPasswordElement.style.borderColor = "red";
      if (confirmPasswordError) confirmPasswordError.textContent = "You must fill this field";
      return;
    } else if (password !== confirmPassword) {
      const confirmPasswordElement = document.getElementById("confirmPassword") as HTMLInputElement;
      if (confirmPasswordElement) confirmPasswordElement.style.borderColor = "red";
      if (confirmPasswordError) confirmPasswordError.textContent = "Passwords do not match";
      return;
    }

    showLoading();
    try {
      const q = query(
        collection(db, "voters"),
        where("voterID", "==", voterID)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.error("Already Registered");
        if (regMsg) regMsg.textContent = "You are already registered !";
        if (regMsg) regMsg.style.backgroundColor = "red";
      } else {
        const docRef = await addDoc(collection(db, "voters"), {
          voterID: voterID,
          voterName: voterName,
          password: password,
        });

        console.log("User registered:", docRef.id);
        if (regMsg) regMsg.textContent = "Registration successful !";
        if (regMsg) regMsg.style.backgroundColor = "green";
        setTimeout(function () {
          window.location.href = "login_page.html";
        }, 2000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (regMsg) regMsg.textContent = "An error occurred during registration.";
      if (regMsg) regMsg.style.backgroundColor = "red";
    } finally {
      hideLoading();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const voterID = (document.getElementById("voterID") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("password") as HTMLInputElement)?.value.trim();
    const regMsg = document.getElementById("regMsg");
    if (regMsg) regMsg.style.backgroundColor = "";

    showLoading();
    try {
      const q = query(
        collection(db, "voters"),
        where("voterID", "==", voterID)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password === password) {
          console.log("User logged in:", userDoc.id);
          if (regMsg) regMsg.textContent = "Login successful! Welcome " + userData.voterName;
          if (regMsg) regMsg.style.backgroundColor = "green";
          setTimeout(() => {
            window.location.href = "voting_page.html"; // Redirect to index.html after login
          }, 2000);
        } else {
          if (regMsg) regMsg.textContent = "Incorrect password. Please try again.";
          if (regMsg) regMsg.style.backgroundColor = "red";
        }
      } else {
        if (regMsg) regMsg.textContent = "User not found. Please check your Voter ID.";
        if (regMsg) regMsg.style.backgroundColor = "red";
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (regMsg) regMsg.textContent = "An error occurred during login.";
      if (regMsg) regMsg.style.backgroundColor = "red";
    } finally {
      hideLoading();
    }
  });
}
