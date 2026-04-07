import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import assets from "../../assets/assets";
import uniqid from "uniqid";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleSubmit = (e) => e.preventDefault();

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId),
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter,
        ),
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updated = [...chapter.chapterContent];
            updated.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updated };
          }
          return chapter;
        }),
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, lectureDetails],
          };
        }
        return chapter;
      }),
    );
    setShowPopup(false);
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write a detailed course description...",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">Create New Course</h1>

        {/* Title */}
        <div>
          <label className="font-medium text-gray-700">Course Title</label>
          <input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g. Complete MERN Stack Bootcamp"
            className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Give a clear and attractive title
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="font-medium text-gray-700">
            Course Description
          </label>
          <div
            ref={editorRef}
            className="bg-white border rounded-lg mt-1 h-44"
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Price (₹)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              placeholder="499"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="20"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="font-medium text-gray-700">Course Thumbnail</label>
          <label className="flex items-center gap-3 mt-2 cursor-pointer">
            <img
              src={assets.file_upload_icon}
              className="w-12 p-3 bg-blue-500 rounded-lg"
              alt=""
            />
            <span className="text-gray-600">Click to upload image</span>
            <input
              type="file"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="mt-3 h-20 rounded-lg border"
              alt=""
            />
          )}
        </div>

        {/* Chapters */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Course Content</h2>

          {chapters.map((chapter) => (
            <div
              key={chapter.chapterId}
              className="border rounded-lg p-4 mb-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{chapter.chapterTitle}</p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                  >
                    ⬇
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChapter("remove", chapter.chapterId)}
                  >
                    ❌
                  </button>
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="mt-2">
                  {chapter.chapterContent.map((lecture, i) => (
                    <div key={i} className="flex justify-between text-sm mb-1">
                      <span>{lecture.lectureTitle}</span>
                      <button
                        onClick={() =>
                          handleLecture("remove", chapter.chapterId, i)
                        }
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleLecture("add", chapter.chapterId)}
                    className="text-blue-500 text-sm mt-1"
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleChapter("add")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            + Add Chapter
          </button>
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-5 rounded-xl w-80 space-y-3">
              <h2 className="font-semibold text-lg">Add Lecture</h2>

              <input
                placeholder="Lecture Title"
                value={lectureDetails.lectureTitle}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureTitle: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <button
                onClick={addLecture}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Add Lecture
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg w-full hover:bg-gray-800 transition"
        >
          Publish Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
