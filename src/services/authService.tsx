import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface RegistrationErrors {
  fullName?: string;
  voterId?: string;
  password?: string;
  confirmPassword?: string;
}

export interface RegistrationResult {
  success: boolean;
  message: string;
  errors?: RegistrationErrors;
}

export interface LoginResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    voterId: string;
    fullName: string;
    faceDescriptor?: number[] | null;
  };
}

/**
 * The registerVoter function now accepts an optional faceDescriptor (as a number[] or null)
 * and stores it in Firestore along with the user’s other data.
 */
export const registerVoter = async (
  voterId: string,
  fullName: string,
  password: string,
  confirmPassword: string,
  faceDescriptor?: number[] | null
): Promise<RegistrationResult> => {
  // Validation
  const errors: RegistrationErrors = {};

  if (!fullName) errors.fullName = "Full name is required";
  if (!voterId) errors.voterId = "Voter ID is required";
  if (isNaN(Number(voterId))) {
    errors.voterId = "Voter ID must contain only numbers";
  }
  if (voterId.length !== 10) {
    errors.voterId = "Voter ID must be 10 digits";
  }

  const strongPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!password) errors.password = "Password is required";
  else if (!strongPassword.test(password)) {
    errors.password =
      "Password must be at least 6 characters with a number, letter, and special character";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Return errors if validation fails.
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validation failed", errors };
  }

  try {
    // Check if voter already exists.
    const q = query(collection(db, "voters"), where("voterId", "==", voterId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: "Voter ID already registered",
        errors: { voterId: "Voter ID already registered" },
      };
    }

    // Add new voter (faceDescriptor is stored if provided)
    await addDoc(collection(db, "voters"), {
      voterId,
      fullName,
      password,
      createdAt: new Date().toISOString(),
      faceDescriptor: faceDescriptor ? faceDescriptor : null,
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
        faceDescriptor: userData.faceDescriptor, // Return the stored face descriptor for later use
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login failed. Please try again." };
  }
};
