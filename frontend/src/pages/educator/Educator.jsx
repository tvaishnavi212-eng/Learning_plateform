import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import assets, { dummyCourses } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Educator = () => {
  const { currency } = useContext(AppContext);
  
  // Dynamic state management
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [newRegistrations, setNewRegistrations] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [liveStats, setLiveStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    activeStudents: 0,
    newToday: 0
  });

  // Real-time WebSocket simulation
  const [socketConnected, setSocketConnected] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);

  // Initialize data from localStorage and dummyCourses
  const initializeData = useCallback(() => {
    // Load courses from localStorage or use dummyCourses
    const storedCourses = localStorage.getItem('educatorCourses');
    const coursesData = storedCourses ? JSON.parse(storedCourses) : dummyCourses;
    setCourses(coursesData);

    // Load only registered students from localStorage (no dummy data)
    const storedStudents = localStorage.getItem('registeredStudents');
    const studentsData = storedStudents ? JSON.parse(storedStudents) : [];
    setStudents(studentsData);

    // Load new registrations (same as registered students)
    const storedRegistrations = localStorage.getItem('newRegistrations');
    const registrationsData = storedRegistrations ? JSON.parse(storedRegistrations) : studentsData;
    setNewRegistrations(registrationsData);

    return { coursesData, studentsData, registrationsData };
  }, []);

  // Calculate live statistics
  const calculateLiveStats = useCallback((coursesData, studentsData) => {
    const totalCourses = coursesData.length;
    const totalStudents = studentsData.length;
    const totalEarnings = coursesData.reduce((sum, course) => {
      const price = course.coursePrice - (course.coursePrice * (course.discount || 0) / 100);
      const enrolledCount = studentsData.filter(s => s.courseId === course._id).length;
      return sum + (price * enrolledCount);
    }, 0);
    const activeStudents = studentsData.filter(s => s.status === 'active').length;
    const newToday = studentsData.filter(s => {
      const today = new Date().toDateString();
      return new Date(s.enrolledDate).toDateString() === today;
    }).length;

    setLiveStats({
      totalCourses,
      totalStudents,
      totalEarnings: totalEarnings.toFixed(2),
      activeStudents,
      newToday
    });
  }, []);

  // Real-time data fetch with WebSocket simulation
  const fetchDashboardData = useCallback(async () => {
    setIsUpdating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { coursesData, studentsData, registrationsData } = initializeData();
      
      // Calculate live statistics
      calculateLiveStats(coursesData, studentsData);
      
      // Process enrolled students data for display
      const enrolledStudentsData = studentsData.map(student => {
        const course = coursesData.find(c => c._id === student.courseId);
        return {
          student: {
            name: student.name,
            imageUrl: student.imageUrl || assets.user_icon,
            email: student.email,
            id: student.id,
            phone: student.phone,
            address: student.address
          },
          courseTitle: course?.courseTitle || 'Unknown Course',
          courseId: student.courseId,
          enrolledDate: student.enrolledDate,
          progress: student.progress || Math.floor(Math.random() * 100),
          status: student.status || 'active',
          paymentStatus: student.paymentStatus || 'completed'
        };
      }).sort((a, b) => new Date(b.enrolledDate) - new Date(a.enrolledDate));

      setDashboardData({
        totalCourses: coursesData.length,
        totalEarnings: liveStats.totalEarnings,
        enrolledStudentsData
      });
      
      setLastUpdated(new Date());
      
      // Add real-time update notification
      addRealTimeUpdate('data_refreshed', { 
        timestamp: new Date().toISOString(),
        studentsCount: studentsData.length,
        coursesCount: coursesData.length
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      addNotification('error', 'Failed to refresh dashboard data');
    } finally {
      setIsUpdating(false);
    }
  }, [initializeData, calculateLiveStats, liveStats.totalEarnings]);

  // Add real-time update
  const addRealTimeUpdate = (type, data) => {
    const update = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString()
    };
    setRealTimeUpdates(prev => [update, ...prev.slice(0, 9)]);
  };

  // Add notification
  const addNotification = (type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
  };

  // Register new student
  const registerStudent = async (studentData) => {
    try {
      setIsUpdating(true);
      
      // Generate unique ID
      const newStudent = {
        ...studentData,
        id: `student_${Date.now()}`,
        enrolledDate: new Date().toISOString(),
        status: 'active',
        progress: 0,
        paymentStatus: 'completed'
      };
      
      // Update students array
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      
      // Save to localStorage
      localStorage.setItem('registeredStudents', JSON.stringify(updatedStudents));
      
      // Add to new registrations
      const updatedRegistrations = [...newRegistrations, newStudent];
      setNewRegistrations(updatedRegistrations);
      localStorage.setItem('newRegistrations', JSON.stringify(updatedRegistrations));
      
      // Add real-time update
      addRealTimeUpdate('student_registered', {
        student: newStudent,
        timestamp: new Date().toISOString()
      });
      
      // Add notification
      addNotification('success', `New student ${newStudent.name} registered successfully!`);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      return { success: true, student: newStudent };
    } catch (error) {
      console.error('Error registering student:', error);
      addNotification('error', 'Failed to register student');
      return { success: false, error: error.message };
    } finally {
      setIsUpdating(false);
    }
  };

  // Simulate WebSocket connection (no random student generation)
  useEffect(() => {
    setSocketConnected(true);
    
    // Only show connection status, no random student generation
    // Students will only appear when actually registered through the form
    
    return () => {
      setSocketConnected(false);
    };
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Real-time Status */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dynamic Educator Dashboard</h1>
              <p className="text-gray-600">Real-time course and student management</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {socketConnected ? 'Live Connected' : 'Disconnected'}
                </span>
              </div>
              
              {/* Real-time Updates Counter */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">{realTimeUpdates.length} Live Updates</span>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-800">{notifications.filter(n => !n.read).length}</span>
                </div>
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {['overview', 'students', 'register', 'live-updates'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeSection === section
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13.253L13 7m0 13-13 13" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{liveStats.totalCourses}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Updated {lastUpdated.toLocaleTimeString()}</div>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{liveStats.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">+{liveStats.newToday} today</div>
          </div>

          {/* Active Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{liveStats.activeStudents}</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
            </div>
            <div className="text-xs text-purple-600 font-medium">{Math.round((liveStats.activeStudents / liveStats.totalStudents) * 100 || 0)}% active</div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{currency}{liveStats.totalEarnings}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
            <div className="text-xs text-yellow-600 font-medium">All time revenue</div>
          </div>

          {/* Live Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{isUpdating ? 'Updating' : 'Live'}</p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </div>
            <div className="text-xs text-red-600 font-medium">{socketConnected ? 'Connected' : 'Offline'}</div>
          </div>
        </div>

        {/* Dynamic Content Based on Active Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection('register')}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="text-blue-800 font-medium">Register New Student</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('students')}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  </svg>
                  <span className="text-green-800 font-medium">View All Students</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('live-updates')}
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-purple-800 font-medium">View Analytics</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Student Registrations</h2>
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
                  <span className="text-xs text-gray-500">Last: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
              
              {realTimeUpdates.filter(u => u.type === 'student_registered').length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 00-4 4v1a4 4 0 004 4h1a4 4 0 004-4v1a4 4 0 00-4-4h-1a4 4 0 00-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No Recent Registrations</h3>
                  <p className="text-xs text-gray-600">Student registrations will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {realTimeUpdates.filter(u => u.type === 'student_registered').slice(0, 5).map((update) => (
                    <div key={update.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          New student registered: {update.data.student?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Course: {courses.find(c => c._id === update.data.student?.courseId)?.courseTitle}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Section */}
        {activeSection === 'students' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Registered Students</h2>
                <div className="text-sm text-gray-500">
                  Total: {students.length} students
                </div>
              </div>
              
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 00-4 4v1a4 4 0 004 4h1a4 4 0 004-4v1a4 4 0 00-4-4h-1a4 4 0 00-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Registered Students</h3>
                  <p className="text-gray-600 mb-4">Students will appear here after they register through the registration form.</p>
                  <button
                    onClick={() => setActiveSection('register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register First Student
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.enrolledStudentsData.map((item, index) => (
                        <tr key={item.student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={item.student.imageUrl}
                                alt={item.student.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{item.student.name}</div>
                                <div className="text-xs text-gray-500">ID: {item.student.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.student.email}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.courseTitle}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{item.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(item.enrolledDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registration Section */}
        {activeSection === 'register' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Register New Student</h2>
              
              <StudentRegistrationForm 
                courses={courses}
                onRegister={registerStudent}
                isSubmitting={isUpdating}
              />
            </div>
          </div>
        )}

        {/* Live Updates Section */}
        {activeSection === 'live-updates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Registration Activity</h2>
              
              {realTimeUpdates.filter(u => u.type === 'student_registered').length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 00-4 4v1a4 4 0 004 4h1a4 4 0 004-4v1a4 4 0 00-4-4h-1a4 4 0 00-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Activity</h3>
                  <p className="text-gray-600 mb-4">Student registration activity will appear here when students register.</p>
                  <button
                    onClick={() => setActiveSection('register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register First Student
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {realTimeUpdates.filter(u => u.type === 'student_registered').map((update) => (
                    <div key={update.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-3 h-3 rounded-full mt-1 bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New Student Registered</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {update.data.student?.name} has enrolled in {courses.find(c => c._id === update.data.student?.courseId)?.courseTitle}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>Email: {update.data.student?.email}</div>
                          <div>Phone: {update.data.student?.phone || 'Not provided'}</div>
                          <div>Registered: {new Date(update.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Student Registration Form Component
const StudentRegistrationForm = ({ courses, onRegister, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    courseId: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onRegister(formData);
    if (result.success) {
      setFormData({
        name: '',
        email: '',
        courseId: '',
        phone: '',
        address: ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseTitle} - ${course.coursePrice}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter address"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registering...' : 'Register Student'}
        </button>
      </div>
    </form>
  );
};

export default Educator;
