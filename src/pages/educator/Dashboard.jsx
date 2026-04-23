import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import assets, { dummyCourses } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDashboardData = async () => {
    setIsUpdating(true);
    
    // Simulate real-time data fetching
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Calculate dashboard data from dummyCourses
    const totalCourses = dummyCourses.length;
    const totalEarnings = dummyCourses.reduce((sum, course) => {
      const price = course.coursePrice - (course.coursePrice * (course.discount || 0) / 100);
      return sum + (price * (course.enrolledStudents?.length || 0)), 0;
    }, 0);

    // Get all enrolled students across all courses with enhanced data
    const enrolledStudentsData = [];
    dummyCourses.forEach(course => {
      if (course.enrolledStudents) {
        course.enrolledStudents.forEach(student => {
          enrolledStudentsData.push({
            student: {
              name: student.name,
              imageUrl: student.imageUrl || assets.user_icon,
              email: student.email || `${(student.name || 'student').toLowerCase().replace(' ', '.')}@example.com`,
              id: student.id || Math.random().toString(36).substr(2, 9)
            },
            courseTitle: course.courseTitle,
            courseId: course._id,
            enrolledDate: student.enrolledDate || new Date().toISOString(),
            progress: student.progress || Math.floor(Math.random() * 100),
            status: student.status || 'active'
          });
        });
      }
    });

    // Sort by most recent enrollment first
    enrolledStudentsData.sort((a, b) => new Date(b.enrolledDate) - new Date(a.enrolledDate));

    setDashboardData({
      totalCourses,
      totalEarnings: totalEarnings.toFixed(2),
      enrolledStudentsData
    });
    setLastUpdated(new Date());
    setIsUpdating(false);
  };

  // Real-time updates every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
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

      {/* Table with Real-time Updates */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Latest Enrollments</h2>
        <div className="flex items-center gap-2">
          {isUpdating && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a8 8 0 01-8 8v4a8 8 0 0018-8z"/>
              </svg>
              Updating...
            </div>
          )}
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-auto w-full">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="p-4 py-3 font-semibold text-center">#</th>
              <th className="p-4 py-3 font-semibold text-left">Student Name</th>
              <th className="p-4 py-3 font-semibold text-left">Email</th>
              <th className="p-4 py-3 font-semibold text-left">Course Title</th>
              <th className="p-4 py-3 font-semibold text-left">Progress</th>
              <th className="p-4 py-3 font-semibold text-left">Enrolled Date</th>
              <th className="p-4 py-3 font-semibold text-left">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-500">
            {dashboardData.enrolledStudentsData.map((item, index) => (
              <tr key={item.student.id} className={`border-t border-gray-500/20 transition-all duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
                <td className="p-4 py-3 text-center">{index + 1}</td>

                <td className="p-4 py-3 flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.student.imageUrl}
                      alt={item.student.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">{item.student.name}</span>
                    <div className="text-xs text-gray-500">ID: {item.student.id}</div>
                  </div>
                </td>

                <td className="p-4 py-3">
                  <div className="text-gray-600">{item.student.email}</div>
                </td>

                <td className="p-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13.253L13 7m0 13-13 13" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-700">{item.courseTitle}</div>
                      <div className="text-xs text-gray-500">Course ID: {item.courseId}</div>
                    </div>
                  </div>
                </td>
                
                <td className="p-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{item.progress}%</span>
                  </div>
                </td>

                <td className="p-4 py-3">
                  <div className="text-gray-600">{new Date(item.enrolledDate).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{new Date(item.enrolledDate).toLocaleTimeString()}</div>
                </td>

                <td className="p-4 py-3">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Course Performance Summary */}
      <h2 className="pb-4 text-lg font-medium">Course Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyCourses.slice(0, 6).map((course) => (
          <div key={course._id} className="bg-white border border-gray-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">{course.courseTitle}</h3>
                <p className="text-xs text-gray-500">by {course.educator?.name || "Instructor"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 00-4 4v1a4 4 0 004 4h1a4 4 0 004-4v1a4 4 0 00-4-4h-1a4 4 0 00-4 4z" />
                </svg>
                <span className="text-gray-600">{course.enrolledStudents?.length || 0} students</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                </svg>
                <span className="text-gray-600">{currency}{(course.coursePrice - (course.coursePrice * (course.discount || 0) / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
