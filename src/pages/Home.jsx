import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ onLogin }) => {
  const navigate = useNavigate();

  // Parse user data (stored in localStorage after login)
  const storedUser = localStorage.getItem("user");
  const isLoggedIn = storedUser ? JSON.parse(storedUser) : null;

  const handleExamClick = (exam) => {
    if (isLoggedIn) {
      navigate(`/courses/${exam.toLowerCase()}`);
    } else {
      // 🚀 Open login modal directly
      if (onLogin) onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
          Crack Your <u>Dream</u> Exam <br /> with{" "}
          <span className="font-bold text-blue-800">Coursido</span>
        </h1>
        <p className="mt-3 text-gray-600 text-base md:text-lg">
          Sign up to Access Free & Premium Mock Tests
        </p>
      </div>

      {/* Exams Section */}
      <div className="mt-10 w-full max-w-3xl space-y-8">
        {/* International Exams */}
        <div>
          <h2 className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg mb-4">
            International Exams
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["GMAT", "GRE", "SAT", "TOEFL"].map((exam) => (
              <button
                key={exam}
                onClick={() => handleExamClick(exam)}
                className="border px-6 py-3 rounded-md bg-white shadow-sm hover:bg-gray-200 transition"
              >
                {exam}
              </button>
            ))}
          </div>
        </div>

        {/* National Exams */}
        <div>
          <h2 className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg mb-4">
            National Exams
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["CAT", "JEE", "NEET", "CLAT"].map((exam) => (
              <button
                key={exam}
                onClick={() => handleExamClick(exam)}
                className="border px-6 py-3 rounded-md bg-white shadow-sm hover:bg-gray-200 transition"
              >
                {exam}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
