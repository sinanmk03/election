import { useNavigate } from "react-router-dom";
import { Vote as Vote2, UserPlus2, BarChart3 } from "lucide-react";
import votin_img from "../assets/voting_image.png";

import NavBar from "../components/NavBar";
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed w-full z-10 bg-blue-900 shadow-lg">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <blockquote className="text-2xl font-medium text-gray-700 italic">
              "Voting is the expression of our commitment to ourselves, one
              another, this country and this world."
              <footer className="mt-2 text-gray-600">- Sharon Salzberg</footer>
            </blockquote>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={votin_img}
              alt="Voting illustration"
              className="rounded-lg shadow-xl max-w-md w-full"
            />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 py-12">
          {/* Register Card */}
          <button
            onClick={() => navigate("/register")}
            className="group p-8 rounded-xl bg-orange-500 hover:bg-orange-600 transition-all transform hover:-translate-y-1 duration-200 shadow-lg"
          >
            <div className="flex flex-col items-center">
              <UserPlus2 className="w-16 h-16 text-white mb-4" />
              <h3 className="text-xl font-semibold text-white">
                Register To Vote
              </h3>
            </div>
          </button>

          {/* Login Card */}
          <button
            onClick={() => navigate("/login")}
            className="group p-8 rounded-xl bg-white hover:bg-gray-50 transition-all transform hover:-translate-y-1 duration-200 shadow-lg"
          >
            <div className="flex flex-col items-center">
              <Vote2 className="w-16 h-16 text-blue-900 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900">
                Login To Vote
              </h3>
            </div>
          </button>

          {/* Results Card */}
          <button
            onClick={() => navigate("/results")}
            className="group p-8 rounded-xl bg-green-600 hover:bg-green-700 transition-all transform hover:-translate-y-1 duration-200 shadow-lg"
          >
            <div className="flex flex-col items-center">
              <BarChart3 className="w-16 h-16 text-white mb-4" />
              <h3 className="text-xl font-semibold text-white">View Results</h3>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
