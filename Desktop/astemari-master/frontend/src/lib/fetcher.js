// /lib/fetcher.js
export const fetchCourses = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/`);

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }
  return res.json();
};

export const fetchChaptersByCourseId = async (courseId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/chapters/${courseId}/chapters/`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch chapters");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchChaptersByCourseId:", error.message);
    throw error;
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/courses/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch course details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchCourseById:", error.message);
    throw error;
  }
};
