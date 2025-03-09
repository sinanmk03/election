import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface RegistrationErrors {
  fullName?: string;
  voterId?: string;
  password?: string;
  confirmPassword?: string;
}

interface RegistrationResult {
  success: boolean;
  message: string;
  errors?: RegistrationErrors;
}

interface LoginResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    voterId: string;
    fullName: string;
  };
}

// Registration function
export const registerVoter = async (
  voterId: string,
  fullName: string,
  password: string,
  confirmPassword: string
): Promise<RegistrationResult> => {
  // Validation
  const errors: RegistrationErrors = {};

  if (!fullName) errors.fullName = "Full name is required";
  if (!voterId) errors.voterId = "Voter ID is required";
  if (isNaN(Number(voterId)))
    errors.voterId = "Voter ID must contain only numbers";
  if (voterId.length !== 10) errors.voterId = "Voter ID must be 10 digits";

  const strongPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;
  if (!password) errors.password = "Password is required";
  else if (!strongPassword.test(password))
    errors.password =
      "Password must be at least 6 characters with a number, letter, and special character";

  if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  // Return errors if any validation fails
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validation failed", errors };
  }

  try {
    // Check if voter exists
    const q = query(collection(db, "voters"), where("voterId", "==", voterId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: "Voter ID already registered",
        errors: { voterId: "Voter ID already registered" },
      };
    }

    // Add new voter
    await addDoc(collection(db, "voters"), {
      voterId,
      fullName,
      password,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: "Registration successful!" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
};

// Login function
export const loginVoter = async (
  voterId: string,
  password: string
): Promise<LoginResult> => {
  try {
    const q = query(collection(db, "voters"), where("voterId", "==", voterId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "User not found" };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return { success: false, message: "Incorrect password" };
    }

    return {
      success: true,
      message: "Login successful!",
      user: {
        id: userDoc.id,
        voterId: userData.voterId,
        fullName: userData.fullName,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login failed. Please try again." };
  }
};
