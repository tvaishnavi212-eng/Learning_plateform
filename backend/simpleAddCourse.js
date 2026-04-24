// Simple script to add course through existing server connection
import fetch from 'node-fetch';

const courseData = {
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

async function addCourse() {
    try {
        // First, get a token (you'll need to replace this with a real token)
        const token = "sk_test_B47RxknvVinoJYqxBwOrx1Gs6xfWRqrMCNrBtjNf2M"; // Replace with actual educator token
        
        const response = await fetch('http://localhost:5000/api/educator/add-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(courseData)
        });

        const result = await response.json();
        console.log('Course added:', result);
    } catch (error) {
        console.error('Error adding course:', error);
    }
}

addCourse();
