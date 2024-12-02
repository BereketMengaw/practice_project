"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "../../utils/auth"; // Assuming these utilities fetch and remove the token

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch("http://localhost:5000/auth/protected-route", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, []);

  const handleLogout = () => {
    removeToken(); // Clear token from local storage
    setUser(null); // Reset user state
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
        </div>

        {/* User Info & Actions */}
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
                className="bg-green-800 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
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
    </nav>
  );
};

export default Navbar;
