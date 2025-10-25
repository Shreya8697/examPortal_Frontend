import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Instructions = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

 useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue =
      "You are not allowed to refresh this page before starting the exam!";
  };
  window.addEventListener("beforeunload", handleBeforeUnload);

  // Prevent back navigation
  window.history.pushState(null, null, window.location.href); // push a dummy state
  const handlePopState = () => {
    // Re-push the state to prevent going back
    window.history.pushState(null, null, window.location.href);
    alert("You are not allowed to go back during the exam!");
  };
  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("popstate", handlePopState);
  };
}, []);


  return (
    <>
      {/* ❗ Top Warning */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 font-medium shadow">
          You are not allowed to refresh this page!
        </div>
      )}

      {/* 🌐 Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-start py-12 px-4">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg border border-gray-200 relative animate-fadeIn">
          {/* 🔵 Top Blue Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-900 rounded-t-xl"></div>

          {/* 📌 Header */}
          <div className="text-center pt-8 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-1 tracking-tight">
              GMAT&trade; Diagnostic Test
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Read all instructions carefully before starting
            </p>
          </div>

          <hr className="mb-8" />

          {/* 📝 Intro */}
          <div className="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-md mx-4 mb-8">
            <p className="text-gray-800 text-base md:text-lg leading-relaxed">
              This diagnostic test will evaluate your skills in{" "}
              <strong>Quantitative Reasoning</strong>,{" "}
              <strong>Verbal Reasoning</strong>, and{" "}
              <strong>Data Insights</strong>. Please read all instructions
              carefully before beginning.
            </p>
          </div>

          {/* 🧭 Sections */}
          <div className="grid gap-6 md:grid-cols-3 px-4 mb-10">
            {[
              {
                num: 1,
                title: "Quantitative Reasoning",
                points: [
                  "Algebra and Arithmetic questions.",
                  "7 questions total.",
                  "15 minutes time limit.",
                ],
              },
              {
                num: 2,
                title: "Verbal Reasoning",
                points: [
                  "Reading Comprehension and Critical Reasoning questions.",
                  "7 questions total.",
                  "15 minutes time limit.",
                ],
              },
              {
                num: 3,
                title: "Data Insights",
                points: [
                  "Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, and Two-Part Analysis questions.",
                  "7 questions total.",
                  "15 minutes time limit.",
                  "On-screen calculator provided.",
                ],
              },
            ].map((sec) => (
              <div
                key={sec.num}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold mr-3">
                    {sec.num}
                  </div>
                  <h2 className="text-blue-900 text-lg font-semibold">
                    {sec.title}
                  </h2>
                </div>
                <ul className="list-none text-gray-600 text-sm space-y-2">
                  {sec.points.map((pt, i) => (
                    <li
                      key={i}
                      className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-500"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ⚠ Important Notes */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-md mx-4 mb-10">
            <h3 className="text-yellow-600 text-2xl font-semibold mb-4">
              Important Notes
            </h3>
            <ul className="list-disc marker:text-orange-600 space-y-3 text-gray-700 pl-6">
              <li>Complete the test in one sitting for the best experience.</li>
              <li>Ensure a quiet environment and stable internet connection.</li>
              <li>
                The test doesn’t autosave — exiting or refreshing resets
                progress.
              </li>
              <li>Do not use external help or materials for accurate results.</li>
            </ul>
          </div>

          {/* 🚀 Start Button */}
          <div className="flex justify-end px-6 pb-8">
            <button
              className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-md hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-all"
              onClick={() => navigate("/mock/gmat/test")}
            >
              Start Test →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Instructions;
