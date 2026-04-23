import { useState, useEffect, useCallback } from 'react';
import { educatorAPI, courseAPI, userAPI, apiUtils } from '../services/apiService';

// Custom hook to handle educator data from backend
export const useEducatorData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    enrolledStudentsData: [],
    totalCourses: 0,
  });
  const [courses, setCourses] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await educatorAPI.getDashboardData();
      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
      }
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch educator courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await educatorAPI.getCourses();
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch enrolled students
  const fetchEnrolledStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await educatorAPI.getEnrolledStudents();
      if (response.data.success) {
        setEnrolledStudents(response.data.enrolledStudentsData);
      }
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new course
  const addCourse = useCallback(async (courseData, imageFile) => {
    try {
      const formattedData = apiUtils.formatCourseData(courseData);
      const response = await educatorAPI.addCourse(formattedData, imageFile);
      if (response.data.success) {
        await fetchCourses(); // Refresh courses list
        return { success: true };
      }
      return { success: false, message: 'Failed to add course' };
    } catch (err) {
      return { success: false, message: apiUtils.handleError(err) };
    }
  }, [fetchCourses]);

  // Update educator role
  const updateToEducator = useCallback(async () => {
    try {
      const response = await educatorAPI.updateRole();
      return response.data.success;
    } catch (err) {
      setError(apiUtils.handleError(err));
      return false;
    }
  }, []);

  // Register new student
  const registerStudent = useCallback(async (studentData) => {
    try {
      const formattedData = apiUtils.formatUserData(studentData);
      const response = await userAPI.registerStudent(formattedData);
      if (response.data.success) {
        await fetchEnrolledStudents(); // Refresh students list
        return { success: true, student: response.data.student };
      }
      return { success: false, message: 'Failed to register student' };
    } catch (err) {
      return { success: false, message: apiUtils.handleError(err) };
    }
  }, [fetchEnrolledStudents]);

  // Enroll student in course
  const enrollStudent = useCallback(async (enrollmentData) => {
    try {
      const response = await purchaseAPI.enrollStudent(enrollmentData);
      if (response.data.success) {
        await Promise.all([
          fetchEnrolledStudents(),
          fetchDashboardData(),
        ]);
        return { success: true, enrollment: response.data.enrollment };
      }
      return { success: false, message: 'Failed to enroll student' };
    } catch (err) {
      return { success: false, message: apiUtils.handleError(err) };
    }
  }, [fetchEnrolledStudents, fetchDashboardData]);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchCourses(),
      fetchEnrolledStudents(),
    ]);
  }, [fetchDashboardData, fetchCourses, fetchEnrolledStudents]);

  // Initial data fetch
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  return {
    dashboardData,
    courses,
    enrolledStudents,
    loading,
    error,
    fetchDashboardData,
    fetchCourses,
    fetchEnrolledStudents,
    addCourse,
    updateToEducator,
    registerStudent,
    enrollStudent,
    refreshAllData,
  };
};

// Custom hook for real-time updates simulation
export const useRealTimeUpdates = (data) => {
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      
      if (random > 0.9) {
        // High priority update
        const update = {
          id: Date.now(),
          type: 'enrollment',
          message: `New student enrolled in ${data.courses[0]?.courseTitle || 'a course'}`,
          timestamp: new Date().toISOString(),
          priority: 'high',
        };
        setLiveUpdates(prev => [update, ...prev.slice(0, 9)]);
        setNotifications(prev => [update, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data.courses]);

  return { liveUpdates, notifications };
};

export default useEducatorData;
