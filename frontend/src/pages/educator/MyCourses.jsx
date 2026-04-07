import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, [allCourses]); // important dependency

  if (!courses) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start md:p-8 p-4 pt-8">
      <div className="w-full">
        <h2 className="text-lg font-medium mb-4">My Courses</h2>

        <table className="w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="py-4 px-3 font-semibold">All Courses</th>
              <th className="py-4 px-3 font-semibold">Earnings</th>
              <th className="py-4 px-3 font-semibold">Students</th>
              <th className="py-4 px-3 font-semibold">Published On</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-500">
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-b border-gray-500/20 hover:bg-gray-50 transition"
              >
                {/* Course */}
                <td className="py-4 px-3 flex items-center gap-3">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <span className="truncate hidden md:block">
                    {course.courseTitle}
                  </span>
                </td>

                {/* Earnings */}
                <td className="py-4 px-3 font-medium">
                  {currency}
                  {Math.floor(
                    course.enrolledStudents.length *
                      (course.coursePrice -
                        (course.discount * course.coursePrice) / 100),
                  )}
                </td>

                {/* Students */}
                <td className="py-4 px-3 font-medium">
                  {course.enrolledStudents.length}
                </td>

                {/* Date */}
                <td className="py-4 px-3 font-medium">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCourses;
