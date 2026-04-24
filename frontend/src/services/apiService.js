import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log the current API URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Educator API endpoints
export const educatorAPI = {
  // Login educator
  login: (credentials) => api.post('/api/educator/login', credentials),
  
  // Update user role to educator
  updateRole: () => api.get('/api/educator/update-role'),
  
  // Get educator dashboard data
  getDashboardData: () => api.get('/api/educator/dashboard'),
  
  // Get educator courses
  getCourses: () => api.get('/api/educator/courses'),
  
  // Add new course
  addCourse: (courseData, imageFile) => {
    const formData = new FormData();
    formData.append('courseData', JSON.stringify(courseData));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return api.post('/api/educator/add-course', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get enrolled students data
  getEnrolledStudents: () => api.get('/api/educator/enrolled-students'),
};

// Course API endpoints
export const courseAPI = {
  // Get all courses
  getAllCourses: () => api.get('/api/course/all'),
  
  // Get course by ID
  getCourseById: (courseId) => api.get(`/api/course/${courseId}`),
  
  // Update course
  updateCourse: (courseId, courseData) => api.put(`/api/course/${courseId}`, courseData),
  
  // Delete course
  deleteCourse: (courseId) => api.delete(`/api/course/${courseId}`),
};

// User API endpoints
export const userAPI = {
  // Get user profile
  getProfile: () => api.get('/api/user/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/api/user/profile', userData),
  
  // Get user course progress
  getCourseProgress: (courseId) => api.get(`/api/user/progress/${courseId}`),
  
  // Update course progress
  updateCourseProgress: (courseId, progressData) => api.post(`/api/user/progress/${courseId}`, progressData),
  
  // Register new student
  registerStudent: (studentData) => api.post('/api/user/register', studentData),
  
  // Get all students
  getAllStudents: () => api.get('/api/user/students'),
  
  // Get student by ID
  getStudentById: (studentId) => api.get(`/api/user/students/${studentId}`),
  
  // Update student
  updateStudent: (studentId, studentData) => api.put(`/api/user/students/${studentId}`, studentData),
  
  // Delete student
  deleteStudent: (studentId) => api.delete(`/api/user/students/${studentId}`),
};

// Purchase API endpoints
export const purchaseAPI = {
  // Create purchase intent
  createPurchase: (purchaseData) => api.post('/api/purchase/create', purchaseData),
  
  // Verify purchase
  verifyPurchase: (purchaseId) => api.post(`/api/purchase/verify/${purchaseId}`),
  
  // Get user purchases
  getUserPurchases: () => api.get('/api/purchase/user'),
  
  // Enroll student in course
  enrollStudent: (enrollmentData) => api.post('/api/purchase/enroll', enrollmentData),
  
  // Get enrollment status
  getEnrollmentStatus: (courseId, userId) => api.get(`/api/purchase/enrollment/${courseId}/${userId}`),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', error);
    return message;
  },
  
  // Format course data for backend
  formatCourseData: (courseData) => ({
    courseTitle: courseData.title,
    courseDescription: courseData.description,
    coursePrice: parseFloat(courseData.price),
    discount: courseData.discount || 0,
    courseContent: courseData.chapters || [],
    isPublished: courseData.status === 'active',
  }),
  
  // Format user data for backend
  formatUserData: (userData) => ({
    name: userData.name,
    email: userData.email,
    imageUrl: userData.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=fff`,
    enrolledCourses: userData.enrolledCourses || [],
  }),
};

export default api;
