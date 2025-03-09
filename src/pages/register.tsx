import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerVoter } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    try {
      const result = await registerVoter(
        formData.voterId,
        formData.fullName,
        formData.password,
        formData.confirmPassword
      );

      if (result.success) {
        setMessage("Registration successful! Redirecting to login...");
        navigate("/login");
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white">Register Now</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[90vh] flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                    message.includes("successful")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {loading && (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
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
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.fullName
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="voterId"
                    className="block text-sm font-medium text-gray-700"
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
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.voterId
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.voterId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.voterId}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
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
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
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
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                    disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
