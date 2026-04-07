import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    useContext(AppContext);

  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 4, totalLectures: 6 },
    { lectureCompleted: 0, totalLectures: 4 },
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 5, totalLectures: 6 },
    { lectureCompleted: 2, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 3, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 5 },
  ]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          {/* HEADER */}
          <thead className="text-gray-600 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Completed</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index];

              const percent = progress
                ? (progress.lectureCompleted / progress.totalLectures) * 100
                : 0;

              const isCompleted =
                progress &&
                progress.lectureCompleted === progress.totalLectures;

              return (
                <tr
                  key={course._id}
                  className="border-b border-gray-500/20 hover:bg-gray-50"
                >
                  {/* COURSE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.courseThumbnail}
                        alt=""
                        className="w-14 sm:w-24 md:w-28"
                      />

                      <div className="w-full">
                        <p className="font-medium">{course.courseTitle}</p>

                        <Line
                          strokeWidth={1}
                          percent={percent}
                          strokeColor={percent === 100 ? "#16a34a" : "#3b82f6"}
                          className="bg-gray-300 "
                        />
                      </div>
                    </div>
                  </td>

                  {/* DURATION */}
                  <td className="px-4 py-3">
                    {calculateCourseDuration(course)}
                  </td>

                  {/* COMPLETED */}
                  <td className="px-4 py-3 ">
                    {progress
                      ? `${progress.lectureCompleted}/${progress.totalLectures}`
                      : "0/0"}
                    <span> Lectures</span>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <button
                      className={`px-3 py-1 rounded text-white ${
                        isCompleted ? "bg-green-600" : "bg-blue-600"
                      }`}
                      onClick={() => navigate("/player/" + course._id)}
                    >
                      {isCompleted ? "Completed" : "In Progress"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default MyEnrollments;
