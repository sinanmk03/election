import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import VotingPage from "./pages/vote";
import ResultPage from "./pages/result";
import AdminPage from "./pages/admin";
// import ProtectedRoute from "./services/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/vote" element={<VotingPage />} />
        {/* <Route
          path="/vote"
          element={
            <ProtectedRoute>
              <VotingPage />
            </ProtectedRoute>
          }
        /> */}
        {/* 404 route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
              <div className="text-center p-8 max-w-md">
                <div className="flex justify-center mb-6">
                  <FileQuestion size={80} className="text-indigo-400" />
                </div>
                <h1 className="text-5xl font-bold mb-4 text-indigo-400">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8">
                  Check the URL in the address bar and try again.
                </p>
                <button
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => (window.location.href = "/")}
                >
                  Return Home
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
