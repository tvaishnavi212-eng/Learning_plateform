import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const sampleCourses = [
    {
        courseTitle: "Complete Web Development Bootcamp",
        courseDescription: "Learn modern web development from scratch with HTML, CSS, JavaScript, React, Node.js and more. Build real projects and deploy them.",
        coursePrice: 49.99,
        discount: 20,
        isPublished: true,
        educator: "user_2sampleEducatorId123456789",
        courseContent: [
            {
                chapterId: "ch1",
                chapterOrder: 1,
                chapterTitle: "Introduction to Web Development",
                chapterContent: [
                    {
                        lectureId: "lec1",
                        lectureTitle: "Course Overview",
                        lectureDuration: 15,
                        lectureUrl: "https://sample-videos.com/lecture1.mp4",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lec2", 
                        lectureTitle: "Setting Up Development Environment",
                        lectureDuration: 25,
                        lectureUrl: "https://sample-videos.com/lecture2.mp4",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            },
            {
                chapterId: "ch2",
                chapterOrder: 2,
                chapterTitle: "HTML & CSS Fundamentals",
                chapterContent: [
                    {
                        lectureId: "lec3",
                        lectureTitle: "HTML Basics",
                        lectureDuration: 30,
                        lectureUrl: "https://sample-videos.com/lecture3.mp4",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lec4",
                        lectureTitle: "CSS Styling",
                        lectureDuration: 35,
                        lectureUrl: "https://sample-videos.com/lecture4.mp4",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            }
        ]
    },
    {
        courseTitle: "React & Redux Masterclass",
        courseDescription: "Master React.js and Redux for building modern web applications. Learn hooks, state management, routing and advanced patterns.",
        coursePrice: 69.99,
        discount: 15,
        isPublished: true,
        educator: "user_2sampleEducatorId123456789",
        courseContent: [
            {
                chapterId: "ch1",
                chapterOrder: 1,
                chapterTitle: "React Fundamentals",
                chapterContent: [
                    {
                        lectureId: "lec1",
                        lectureTitle: "What is React?",
                        lectureDuration: 20,
                        lectureUrl: "https://sample-videos.com/react-lecture1.mp4",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lec2",
                        lectureTitle: "Components and Props",
                        lectureDuration: 40,
                        lectureUrl: "https://sample-videos.com/react-lecture2.mp4",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            }
        ]
    },
    {
        courseTitle: "Node.js & Express Backend Development",
        courseDescription: "Learn backend development with Node.js and Express. Build RESTful APIs, work with databases, and deploy applications.",
        coursePrice: 59.99,
        discount: 25,
        isPublished: true,
        educator: "user_2sampleEducatorId123456789",
        courseContent: [
            {
                chapterId: "ch1",
                chapterOrder: 1,
                chapterTitle: "Node.js Introduction",
                chapterContent: [
                    {
                        lectureId: "lec1",
                        lectureTitle: "Getting Started with Node.js",
                        lectureDuration: 25,
                        lectureUrl: "https://sample-videos.com/node-lecture1.mp4",
                        isPreviewFree: true,
                        lectureOrder: 1
                    }
                ]
            }
        ]
    }
];

async function addSampleCourses() {
    try {
        // Connect to MongoDB using same method as server
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4,
        });
        console.log('Connected to MongoDB');

        // Clear existing courses (optional - remove if you want to keep existing data)
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Add sample courses
        const insertedCourses = await Course.insertMany(sampleCourses);
        console.log(`Inserted ${insertedCourses.length} sample courses`);

        // Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error adding sample courses:', error);
    }
}

addSampleCourses();
