// /app/page.js
"use client";

import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import Hero from "../components/Hero";
import { fetchCourses } from "../lib/fetcher";
import Category from "@/components/Category";
import Navbar from "@/components/Navbar/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <Hero />
      <Category />
    </>
  );
};

export default HomePage;
