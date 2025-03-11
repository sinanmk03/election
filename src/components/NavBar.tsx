import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = ["Home", "Admin", "Vote", "Results", "Contact"];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2" onClick={() => navigate("/")}>
          <img src={logo} className="h-10 w-10" alt="Logo" />
          <h1 className="text-2xl font-bold text-white">Secure Vote</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navigationItems.map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <li key={item}>
                  <Link
                    to={path}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="pb-4">
            {navigationItems.map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <li key={item}>
                  <Link
                    to={path}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-800 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
