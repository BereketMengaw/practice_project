"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../utils/auth";
import Navbar from "@/components/Navbar/Navbar";

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

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <h1>Welcome, {user.name}</h1>
      <p>Your phone number: {user.phoneNumber}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
