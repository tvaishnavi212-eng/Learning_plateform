import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled);
  };
  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  return enrolledStudents ? (
    <div>
      <div>
        <table>
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="py-4 px-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="py-4 px-3 font-semibold text-center">
                Student Name
              </th>
              <th className="py-4 px-3 font-semibold text-center">
                Course Title
              </th>
              <th className="py-4 px-3 font-semibold text-center hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="py-4 px-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="py-4 px-3 text-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-10 h-10 rounded-full inline-block"
                  />
                  <span className="text-gray-700 inline-block">
                    {item.student.name}
                  </span>
                </td>
                <td className="py-4 px-3 text-center">{item.courseTitle}</td>
                <td className="py-4 px-3 text-center hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
