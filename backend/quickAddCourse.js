import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const sampleCourse = {
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
        }
    ]
};

async function quickAddCourse() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4,
        });
        console.log('Connected to MongoDB');

        // Add sample course
        const newCourse = new Course(sampleCourse);
        await newCourse.save();
        console.log('Sample course added successfully!');

        // Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error adding course:', error);
    }
}

quickAddCourse();
