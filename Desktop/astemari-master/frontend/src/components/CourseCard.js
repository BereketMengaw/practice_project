import React from "react";
import Link from "next/link";

const CourseCard = ({ course }) => {
  const thumbnailUrl = course.thumbnail
    ? `http://localhost:5000${course.thumbnail}`
    : null;

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Link to the course page */}
      <Link href={`/courses/${course.id}`}>
        {/* Thumbnail */}
        {thumbnailUrl ? (
          <img
            className="w-full h-48 object-cover"
            src={thumbnailUrl}
            alt={course.title}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}

        {/* Course Details */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {course.description}
          </p>

          {/* Creator & Category */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-500 text-sm">
              By {course.creator?.name}
            </span>
            <span className="text-gray-500 text-sm">
              {course.category?.name}
            </span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-xl font-bold text-gray-800">
              {course.price} ETB
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
