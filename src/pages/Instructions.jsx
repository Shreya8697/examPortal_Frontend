import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Instructions = () => {
    const navigate = useNavigate();
 
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You are not allowed to refresh this page before starting the exam!";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

     return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
     {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          You are not allowed to refresh this page!
        </div>
      )}
      <div className="flex justify-center mt-8 px-4">
        <div className="max-w-6xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              GMAT&trade; Diagnostic Test
            </h1>
            <hr className="opacity-10 " />
          </div>

          {/* Intro Section */}
          <div className="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-md mb-8">
            <p className="text-gray-800 text-base md:text-lg leading-relaxed">
              This diagnostic test will evaluate your skills in{" "}
              <strong>Quantitative Reasoning</strong>,{" "}
              <strong>Verbal Reasoning</strong>, and <strong>Data Insights</strong>. 
              Please read all instructions carefully before beginning.
            </p>
          </div>

          {/* Test Sections */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {/* Quantitative */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-blue-900 text-lg font-semibold">
                  Quantitative Reasoning
                </h2>
              </div>
              <ul className="list-none pl-5 text-gray-600 text-sm space-y-2 relative">
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  Algebra and Arithmetic questions.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  7 questions total.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  15 minutes time limit.
                </li>
              </ul>
            </div>

            {/* Verbal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h2 className="text-blue-900 text-lg font-semibold">
                  Verbal Reasoning
                </h2>
              </div>
              <ul className="list-none pl-5 text-gray-600 text-sm space-y-2 relative">
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  Reading Comprehension and Critical Reasoning questions.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  7 questions total.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  15 minutes time limit.
                </li>
              </ul>
            </div>

            {/* Data Insights */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h2 className="text-blue-900 text-lg font-semibold">
                  Data Insights
                </h2>
              </div>
              <ul className="list-none pl-5 text-gray-600 text-sm space-y-2 relative">
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, and Two-Part Analysis questions.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  7 questions total.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  15 minutes time limit.
                </li>
                <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-yellow-400">
                  On-screen calculator provided.
                </li>
              </ul>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-md mb-10">
            <h3 className="text-yellow-600 text-[25px] font-semibold mb-4">
              Important Notes
            </h3>
           <ul className="list-disc marker:text-orange-700 space-y-4 text-gray-600 pl-[50px]">
  <li className="pl-2">
    We recommend completing the test in one sitting for the best experience.
  </li>
  <li className="pl-2">
    Make sure you're in a quiet place with a stable internet connection before starting.
  </li>
  <li className="pl-2">
    The test doesn’t autosave, so if you exit or refresh, you'll need to start over.
  </li>
  <li className="pl-2">
    For accurate results, do not use external help or materials.
  </li>
</ul>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 md:space-x-6 flex-wrap gap-2">
            <button
              className="bg-blue-900 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-800 hover:-translate-y-1 transition-all"
              onClick={() => navigate("/mock/gmat/test")}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Instructions;
