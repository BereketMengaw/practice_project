import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard"; // Import the CourseCard component

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State to track the selected category
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const coursesPerPage = 6; // Limit courses per page to 3

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch all courses
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCategories();
    fetchCourses();
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // Set selected category
    setCurrentPage(1); // Reset to the first page
  };

  // Filter courses based on selected category or show all
  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.categoryId === selectedCategory)
    : courses;

  // Calculate pagination data
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">All Categories</h1>

      {/* Category options displayed horizontally */}
      <div className="flex space-x-6 mb-8 justify-center">
        <button
          onClick={() => handleCategorySelect(null)} // Show all courses
          className={`text-lg font-semibold px-4 py-2 border rounded ${
            selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>

        {categories.length > 0 &&
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`text-lg font-semibold px-4 py-2 border rounded ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
      </div>

      {/* Display filtered and paginated courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCourses.length > 0 ? (
          paginatedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="text-center text-gray-500">No courses available</p>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
