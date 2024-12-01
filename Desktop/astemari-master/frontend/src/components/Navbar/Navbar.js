"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getToken, removeToken } from "../../utils/auth"; // Assuming these utility functions are defined to manage tokens
import { useRouter } from "next/navigation";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/auth/protected-route", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {
        removeToken();
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    removeToken(); // Removes the token from storage
    setUser(null); // Resets the user state
  };

  return (
    <nav className="bg-transparent top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-green-800 hover:text-green-600"
        >
          Astemari
        </Link>

        {/* Navbar Links */}
        <div className="hidden md:flex space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/about"
                className="text-white hover:text-white font-semibold"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/add-course"
                className="text-white hover:text-white font-semibold"
              >
                Add Course
              </Link>
            </li>
          </ul>

          {/* Conditional Rendering of Login/Logout or Username */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white font-semibold">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-green-800 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 hover:text-black transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-transparent text-white px-6 py-2 rounded-lg text-lg font-semibold border-2 border-white hover:bg-white hover:text-green-800 transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-800 text-white p-4">
          <ul className="space-y-4">
            <li>
              <Link
                href="/about"
                className="block font-semibold hover:text-green-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/add-course"
                className="block font-semibold hover:text-green-300"
              >
                Add Course
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <span className="block font-semibold hover:text-green-300">
                    Hello, {user.phoneNumber}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block font-semibold hover:text-green-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block font-semibold hover:text-green-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="block font-semibold hover:text-green-300"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
