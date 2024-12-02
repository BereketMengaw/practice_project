"use client";

import React, { useState } from "react";

export default function CourseDetails({ course, chapters }) {
  const [loading, setLoading] = useState(false); // Add loading state

  // Handle Buy button click
  const handleBuy = async () => {
    const authToken = localStorage.getItem("token"); // Retrieve auth token from localStorage

    if (!authToken) {
      // If not logged in, redirect to the login page
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true); // Set loading state to true when payment is being processed

      // Prepare the data for payment initialization
      const paymentData = {
        username: "bereket", // Replace with actual username logic
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
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  const verifyPayment = async (receiptData) => {
    // Make a request to verify the payment with the receipt data (transaction ID, etc.)
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/verify-payment/${receiptData.transactionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        alert("Payment successful!");

        // Redirect to course page after successful payment
        window.location.href = `/courses/${course.id}`;
      } else {
        alert("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("An error occurred while verifying the payment.");
    }
  };

  if (!course) {
    return (
      <p className="text-center text-red-500 font-semibold">Course not found</p>
    );
  }

  return (
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
          disabled={loading} // Disable button while loading
        >
          {loading ? "Processing..." : "Buy Now"}
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
    </div>
  );
}
