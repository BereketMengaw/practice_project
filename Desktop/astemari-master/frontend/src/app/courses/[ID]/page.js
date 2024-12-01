import { fetchCourseById, fetchChaptersByCourseId } from "@/lib/fetcher";
import CourseDetails from "./CourseDetails";
import Navbar from "@/components/Navbar/Navbar";

export default async function CoursePage({ params }) {
  const { ID } = await params;

  // Fetch course and chapters data
  const course = await fetchCourseById(ID);
  const chapters = await fetchChaptersByCourseId(ID);

  return (
    <div>
      <Navbar classname="bg-green bg-red-400" />
      <CourseDetails course={course} chapters={chapters} />
    </div>
  );
}
