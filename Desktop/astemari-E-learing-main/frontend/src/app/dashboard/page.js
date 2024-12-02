"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../utils/auth";
import Navbar from "@/components/Navbar/Navbars";

const Dashboard = () => {
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
    removeToken(); // Clear the token from local storage
    router.push("/login"); // Redirect to login page
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-800">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-green-800 mb-4">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-700 mb-6">
            <span className="font-semibold">Phone Number:</span>{" "}
            {user.phoneNumber}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
