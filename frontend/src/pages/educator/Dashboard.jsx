import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import assets, { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start gap-8 md:p-8 p-4 pt-8">
      {/* Cards */}
      <div className="flex flex-wrap gap-5">
        {/* Total Courses */}
        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
          <img src={assets.appointments_icon} alt="courses" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashboardData.totalCourses}
            </p>
            <p className="text-base text-gray-500">Total Courses</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
          <img src={assets.earning_icon} alt="earnings" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {currency}
              {dashboardData.totalEarnings}
            </p>
            <p className="text-base text-gray-500">Total Earnings</p>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
          <img src={assets.patients_icon} alt="students" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-base text-gray-500">Total Enrollments</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>

      <div className="flex flex-col gap-4 w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-auto w-full">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="p-4 py-3 font-semibold text-center">#</th>
              <th className="p-4 py-3 font-semibold text-left">Student Name</th>
              <th className="p-4 py-3 font-semibold text-left">Course Title</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-500">
            {dashboardData.enrolledStudentsData.map((item, index) => (
              <tr key={index} className="border-t border-gray-500/20">
                <td className="p-4 py-3 text-center">{index + 1}</td>

                <td className="p-4 py-3 flex items-center gap-3">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-gray-700">{item.student.name}</span>
                </td>

                <td className="p-4 py-3">{item.courseTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
