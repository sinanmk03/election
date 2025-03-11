import { useState, useRef, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { registerVoter } from "../services/authService";
import { Camera, User, Vote } from "lucide-react";

export default function RegisterFacePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    voterId: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    voterId: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Face capture state
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
  const [faceError, setFaceError] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api.js models from /models folder in public
  useEffect(() => {
    async function loadModels() {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading face recognition models:", err);
      }
    }
    loadModels();
  }, []);

  // Start webcam once models are loaded
  useEffect(() => {
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  // Capture face descriptor from the webcam feed
  const captureFace = async () => {
    setFaceError("");
    if (!modelsLoaded || !videoRef.current) {
      setFaceError("Models not loaded or video unavailable.");
      return;
    }
    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setFaceError("No face detected. Please try again.");
        return;
      }

      setFaceDescriptor(Array.from(detection.descriptor));
      setMessage("Face captured successfully!");
    } catch (err) {
      console.error("Face capture error:", err);
      setFaceError("Error capturing face. Try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({
      fullName: "",
      voterId: "",
      password: "",
      confirmPassword: "",
    });
    setFaceError("");

    let hasErrors = false;
    if (!formData.fullName) {
      setErrors((prev) => ({ ...prev, fullName: "Full Name is required" }));
      hasErrors = true;
    }
    if (!formData.voterId) {
      setErrors((prev) => ({ ...prev, voterId: "Voter ID is required" }));
      hasErrors = true;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasErrors = true;
    }
    if (!formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password is required",
      }));
      hasErrors = true;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasErrors = true;
    }
    if (!faceDescriptor) {
      setFaceError("Please capture your face before registering.");
      hasErrors = true;
    }

    if (hasErrors) {
      setLoading(false);
      return;
    }

    try {
      const result = await registerVoter(
        formData.voterId,
        formData.fullName,
        formData.password,
        formData.confirmPassword,
        faceDescriptor // Pass the captured face descriptor (or null)
      );

      if (result.success) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        if (result.errors) {
          setErrors({
            fullName: result.errors.fullName || "",
            voterId: result.errors.voterId || "",
            password: result.errors.password || "",
            confirmPassword: result.errors.confirmPassword || "",
          });
        }
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center space-x-3">
            <Vote className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">
              Secure Voter Registration
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[90vh] py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Form */}
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <User className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                    message.includes("successful")
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        errors.fullName
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="voterId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Voter ID
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="voterId"
                      value={formData.voterId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          voterId: e.target.value,
                        }))
                      }
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        errors.voterId
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.voterId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.voterId}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
                    bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </form>
            </div>

            {/* Face Capture Section */}
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <Camera className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Face Registration
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="aspect-w-4 aspect-h-3 mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover rounded-lg shadow-inner"
                  />
                </div>
                <button
                  onClick={captureFace}
                  disabled={!modelsLoaded}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
                    bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                    disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Face</span>
                </button>
              </div>

              {!modelsLoaded && (
                <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  Loading face recognition models...
                </div>
              )}

              {faceError && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {faceError}
                </div>
              )}

              {faceDescriptor && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Face captured successfully! You can now complete your
                  registration.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
