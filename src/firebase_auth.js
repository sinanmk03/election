import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
  loadingWidget.style.display = "flex";
}

function hideLoading() {
  loadingWidget.style.display = "none";
}

if (registrationForm) {
  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const voterID = document.getElementById("voterID").value.trim();
    const voterName = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const idError = document.getElementById("idError");
    const nameError = document.getElementById("nameError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById(
      "confirmPasswordError"
    );
    const regMsg = document.getElementById("regMsg");

    [idError, nameError, passwordError, confirmPasswordError].forEach(
      (element) => {
        if (element) element.textContent = "";
      }
    );

    ["voterID", "name", "password", "confirmPassword"].forEach((fieldId) => {
      document.getElementById(fieldId).style.borderColor = "";
    });

    if (voterName == "") {
      nameError.textContent = "You must fill this field";
      document.getElementById("name").style.borderColor = "red";
      return;
    }
    if (voterID == "") {
      idError.textContent = "You must fill this field";
      document.getElementById("voterID").style.borderColor = "red";
      return;
    } else if (isNaN(voterID)) {
      idError.textContent = "VoterID only contains numbers";
      document.getElementById("voterID").style.borderColor = "red";
      return;
    } else if (voterID.length != 10) {
      idError.textContent = "Voter ID should be 10 digits";
      document.getElementById("voterID").style.borderColor = "red";
      return;
    }

    const StrongPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;
    if (password == "") {
      passwordError.textContent = "You must fill this field";
      document.getElementById("password").style.borderColor = "red";
      return;
    } else if (!StrongPassword.test(password)) {
      passwordError.textContent =
        "Password should contain numbers, letters, and special characters";
      document.getElementById("password").style.borderColor = "red";
      return;
    }
    if (confirmPassword == "") {
      confirmPasswordError.textContent = "You must fill this field";
      document.getElementById("confirmPassword").style.borderColor = "red";
      return;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Password do not match";
      document.getElementById("confirmPassword").style.borderColor = "red";
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
        regMsg.textContent = "You are already registered !";
        regMsg.style.backgroundColor = "red";
      } else {
        const docRef = await addDoc(collection(db, "voters"), {
          voterID: voterID,
          voterName: voterName,
          password: password,
        });

        console.log("User registered:", docRef.id);
        regMsg.textContent = "Registeration successfull !";
        regMsg.style.backgroundColor = "green";
        setTimeout(function () {
          window.location.href = "login_page.html";
        }, 2000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      regMsg.textContent = "An error occurred during registration.";
      regMsg.style.backgroundColor = "red";
    } finally {
      hideLoading();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const voterID = document.getElementById("voterID").value.trim();
    const password = document.getElementById("password").value.trim();
    const regMsg = document.getElementById("regMsg");
    regMsg.style.backgroundColor = "";

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
          regMsg.textContent =
            "Login successful! Welcome " + userData.voterName;
          regMsg.style.backgroundColor = "green";
          setTimeout(() => {
            window.location.href = "voting_page.html"; // Redirect to index.html after login
          }, 2000);
        } else {
          regMsg.textContent = "Incorrect password. Please try again.";
          regMsg.style.backgroundColor = "red";
        }
      } else {
        regMsg.textContent = "User not found. Please check your Voter ID.";
        regMsg.style.backgroundColor = "red";
      }
    } catch (error) {
      console.error("Error during login:", error);
      regMsg.textContent = "An error occurred during login.";
      regMsg.style.backgroundColor = "red";
    } finally {
      hideLoading();
    }
  });
}
