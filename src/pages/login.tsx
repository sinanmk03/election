import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    voterId: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    voterId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ voterId: "", password: "" });

    // Validate form
    let hasErrors = false;
    if (!formData.voterId) {
      setErrors((prev) => ({ ...prev, voterId: "Voter ID is required" }));
      hasErrors = true;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasErrors = true;
    }

    if (hasErrors) {
      setLoading(false);
      return;
    }

    try {

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white">Login To Vote</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[90vh] flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
              {/* Status Message */}
              {message && (
                <div
                  className={`mb-4 p-4 rounded-lg text-sm font-medium ${
                    message.includes("successful")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Loading Spinner */}
                {loading && (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  </div>
                )}

                {/* Voter ID Field */}
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
                    className={`mt-1 block w-full rounded-md shadow-sm
                      ${
                        errors.voterId
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }
                    `}
                    placeholder="Enter Voter ID"
                  />
                  {errors.voterId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.voterId}
                    </p>
                  )}
                </div>

                {/* Password Field */}
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
                    className={`mt-1 block w-full rounded-md shadow-sm
                      ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }
                    `}
                    placeholder="Enter Password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
