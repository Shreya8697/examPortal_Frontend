import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, BookOpen, Globe2, Lock } from "lucide-react";

const Home = ({ onLogin }) => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const isLoggedIn = storedUser ? JSON.parse(storedUser) : null;

  const handleExamClick = (exam) => {
    if (isLoggedIn) {
      navigate(`/mock/${exam.toLowerCase()}`);
    } else {
      if (onLogin) onLogin();
    }
  };

  const internationalExams = [
    { name: "GMAT", icon: Globe2 },
    { name: "GRE", icon: Globe2 },
    { name: "SAT", icon: Globe2 },
    { name: "TOEFL", icon: Globe2 },
  ];

  const nationalExams = [
    { name: "CAT", icon: BookOpen },
    { name: "JEE", icon: BookOpen },
    { name: "NEET", icon: BookOpen },
    { name: "CLAT", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      

      {/* Hero Section */}
      <div className="text-center mt-16 px-4 max-w-3xl">
        <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1 rounded-full mb-4 text-sm font-medium gap-1">
          <ShieldCheck size={16} /> Trusted by 2,000+ Aspirants
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Prepare & Succeed in Your <span className="text-blue-600">Dream Exam</span>
        </h1>
        <p className="mt-4 text-gray-700 text-base md:text-lg">
          Access premium mock tests, real exam simulations, and track your performance in a secure environment.
        </p>
        
      </div>

      {/* Exams Section */}
      <div className="w-full max-w-4xl mt-12 px-4">
        <Section title="International Exams" exams={internationalExams} handleExamClick={handleExamClick} />
        <Section title="National Exams" exams={nationalExams} handleExamClick={handleExamClick} />
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full py-5 text-center text-gray-500 text-sm   bg-white">
        © {new Date().getFullYear()} Coursido. All Rights Reserved.
      </footer>
    </div>
  );
};

const Section = ({ title, exams, handleExamClick }) => (
  <div className="mb-10">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {exams.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => handleExamClick(name)}
          className="w-full border border-gray-200 bg-white py-4 rounded-lg text-gray-800 font-medium hover:bg-blue-50 hover:border-blue-300 transition shadow-sm flex flex-col items-center justify-center gap-2"
        >
          <Icon className="text-blue-600" size={24} />
          <span>{name}</span>
        </button>
      ))}
    </div>
  </div>
);

export default Home;
