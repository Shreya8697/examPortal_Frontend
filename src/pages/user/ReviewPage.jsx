// ReviewPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MathJaxContext } from "better-react-mathjax";
import QuantReview from "./Review/QuantReview";
import VerbalReview from "./Review/VerbalReview";
import DataInsightReview from "./Review/DataInsightReview";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ReviewPage() {
  const { examType, testName, attempt, sectionName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [section, setSection] = useState(state?.section || null);
  const [loading, setLoading] = useState(false);
  const email = state?.email;

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  useEffect(() => {
    const fetchSection = async () => {
      if (section) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/website/exam/results/${examType}/${testName}/${attempt}?email=${email}`
        );

        if (res.data?.sections) {
          const target = (sectionName || examType || "").toLowerCase();
          const matched =
            res.data.sections.find((sec) => {
              const secName = (sec.name || sec.sectionName || "").toLowerCase();
              return secName === target || secName.includes(target);
            }) || res.data.sections[0];

          setSection(matched);
        } else {
          console.warn("⚠️ No sections found in response", res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching review data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, [examType, testName, attempt, email, section, sectionName]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading review data...</p>
        </div>
      </div>
    );

  if (!section)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-slate-300 text-center max-w-sm w-full">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm sm:text-base text-gray-700 mb-3">No section data found. Please return to the result page.</p>
          <button
            className="px-4 py-2 sm:px-5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            ← Back to Results
          </button>
        </div>
      </div>
    );

  const renderSectionReview = () => {
    const secName = (section.name || section.sectionName || "").toLowerCase();
    switch (secName) {
      case "quant":
        return <QuantReview section={section} onBack={() => navigate(-1)} />;
      case "verbal":
        return <VerbalReview section={section} onBack={() => navigate(-1)} />;
      case "datainsights":
        return <DataInsightReview section={section} onBack={() => navigate(-1)} />;
      default:
        return <QuantReview section={section} onBack={() => navigate(-1)} />;
    }
  };

  return (
   <MathJaxContext>
  <div className="min-h-screen p-2 sm:p-4">
    <div className="max-w-[95%] sm:max-w-[90%] mx-auto">
      {/* Header */}
      <div className="relative bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-slate-300 mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        
        {/* Left Section - Title */}
        <div className="flex items-center flex-1">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">
              {examType} — {section.name || section.sectionName} Review
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Test: {testName} | Attempt: {attempt}
            </p>
          </div>
        </div>

        {/* 🕒 Center Section Time (absolutely centered on desktop) */}
        <div className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 text-center text-gray-700 font-medium text-sm sm:text-base">
          Total Section Time: {formatTime(section.totalTime)}
        </div>

        {/* Right Side - Back Button */}
        <button
          className="px-3 py-2 sm:px-4 sm:py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
          onClick={() => navigate(-1)}
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Section Review Content */}
      {renderSectionReview()}
    </div>
  </div>
</MathJaxContext>

  );
}
