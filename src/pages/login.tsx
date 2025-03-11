import { useState, useRef, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { loginVoter } from "../services/authService";
import { Camera } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ voterId: "", password: "" });
  const [errors, setErrors] = useState({ voterId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Face capture states for login
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [liveFaceDescriptor, setLiveFaceDescriptor] = useState<number[] | null>(
    null
  );
  const [faceError, setFaceError] = useState("");

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

  // Capture live face descriptor from webcam
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
      setLiveFaceDescriptor(Array.from(detection.descriptor));
      setMessage("Face captured successfully!");
    } catch (err) {
      console.error("Face capture error:", err);
      setFaceError("Error capturing face. Try again.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ voterId: "", password: "" });
    setMessage("");
    setFaceError("");

    // Validate form fields
    if (!formData.voterId || !formData.password) {
      setErrors({
        voterId: !formData.voterId ? "Voter ID is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      setLoading(false);
      return;
    }
    // Ensure a face has been captured
    if (!liveFaceDescriptor) {
      setFaceError("Please capture your face before logging in.");
      setLoading(false);
      return;
    }

    try {
      const result = await loginVoter(formData.voterId, formData.password);
      if (result.success && result.user) {
        // Ensure user has a stored face descriptor for comparison
        if (!result.user.faceDescriptor) {
          setMessage(
            "No face data available for this user. Please contact support."
          );
          setLoading(false);
          return;
        }
        // Compare live descriptor with stored descriptor using Euclidean distance
        const distance = faceapi.euclideanDistance(
          new Float32Array(liveFaceDescriptor),
          new Float32Array(result.user.faceDescriptor)
        );
        console.log("Face distance:", distance);
        // If the distance is below a threshold, consider it a match
        if (distance < 0.6) {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => navigate("/vote"), 1500);
        } else {
          setMessage("Face not recognized. Please try again.");
        }
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Secure Voting System
            </h1>
            <p className="text-blue-200 text-center mt-2">
              Login with your credentials and face verification
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-8 py-12">
          {/* Login Form */}
          <div className="w-full max-w-md">
            <div className="bg-white shadow-2xl rounded-2xl px-8 pt-8 pb-10 backdrop-blur-lg bg-opacity-90">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Voter Login
              </h2>
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                    message.includes("successful")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="voterId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Voter ID
                  </label>
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
                    className={`block w-full px-4 py-3 rounded-xl shadow-sm transition-colors ${
                      errors.voterId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your Voter ID"
                  />
                  {errors.voterId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.voterId}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
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
                    className={`block w-full px-4 py-3 rounded-xl shadow-sm transition-colors ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? "Verifying..." : "Login to Vote"}
                </button>
              </form>
            </div>
          </div>

          {/* Face Verification Section */}
          <div className="w-full max-w-md">
            <div className="bg-white shadow-2xl rounded-2xl p-8 backdrop-blur-lg bg-opacity-90">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Face Verification
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="aspect-w-4 aspect-h-3 mb-6">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover rounded-xl shadow-inner"
                  />
                </div>
                <button
                  onClick={captureFace}
                  disabled={!modelsLoaded}
                  className="w-full py-3 px-4 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Face</span>
                </button>
              </div>
              {faceError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {faceError}
                </div>
              )}
              {liveFaceDescriptor && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                  Face captured successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
