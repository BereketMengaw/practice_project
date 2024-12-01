"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "../utils/auth";
import Navbar from "@/components/Navbar/Navbar";

export default function CourseDetails({ course, chapters }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle Buy button click
  const handleBuy = async () => {
    const authToken = localStorage.getItem("authToken"); // Retrieve auth token from localStorage

    if (!authToken) {
      // If not logged in, prompt for login
      alert("Please log in to purchase this course.");
      return;
    }

    try {
      // Prepare the data for payment initialization
      const paymentData = {
        username: "bereket", // Replace with actual username logic, i.e. from decoded token
        courseTitle: course.title, // Replace with actual course title
      };

      // Send a payment initialization request to the backend
      const response = await fetch(
        "http://localhost:5000/api/payments/initialize-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Pass the auth token for verification
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.data.checkout_url) {
        // Redirect to the checkout URL provided by the backend
        window.location.href = data.data.checkout_url;
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (res.ok) {
        const data = await res.json();
        saveToken(data.token);
        router.push("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  if (!course) {
    return (
      <p className="text-center text-red-500 font-semibold">Course not found</p>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white shadow-md rounded-lg">
        {/* Course Details */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>Creator: {course.creator?.name || "Unknown"}</span>
            <span>Category: {course.category?.name || "Uncategorized"}</span>
            <span>
              Price: <span className="font-semibold">{course.price} ETB</span>
            </span>
          </div>
        </div>

        {/* Buy Button */}
        <div className="text-center">
          <button
            onClick={handleBuy}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Buy Now
          </button>
        </div>

        {/* Chapters Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Chapters</h2>
          {chapters.length > 0 ? (
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {chapters.map((chapter, index) => (
                <li
                  key={chapter.id}
                  className="p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                >
                  <span className="text-gray-800 font-medium">
                    {index + 1}. {chapter.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    Order: {chapter.order}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No chapters available for this course.
            </p>
          )}
        </div>

        {/* Login Form */}
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-700">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
