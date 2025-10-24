// QuantReview.jsx
import React, { useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

export default function QuantReview({ section }) {
  const [current, setCurrent] = useState(0);
  const q = section.questions[current];

  const next = () =>
    current < section.questions.length - 1 && setCurrent((c) => c + 1);
  const prev = () => current > 0 && setCurrent((c) => c - 1);

  // Format seconds to Xm Ys
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <MathJaxContext>
     
        {/* Question Box */}
        <div className=" max-w-[99%] mb-[100px] mx-auto mt-4 bg-white p-6 rounded-xl shadow-xl border border-slate-300">
          <div className="mb-4 text-gray-900 text-base sm:text-lg leading-relaxed flex items-start">
            <span className="mr-2 font-bold text-indigo-700 text-xl">{current + 1}.</span>
            <div className="flex-1">
              <div dangerouslySetInnerHTML={{ __html: q.text }} />
              {/* Time for this question moved here */}
              <div className="mt-2 inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium shadow-sm">
                Time Taken: {formatTime(q.timeTaken)}
              </div>
            </div>
          </div>

          {/* Options */}
          {q.options?.length > 0 && (
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                let label = "";
                let isCorrect = i === q.correct;
                let isSelected = i === q.selected;
                let className = "p-3 rounded-lg border-2 shadow-md transition-all duration-300 ";

                if (isCorrect && isSelected) {
                  className += "border-green-500 bg-green-50 shadow-green-200";
                  label = "Your Answer (Correct)";
                } else if (isCorrect) {
                  className += "border-green-500 bg-green-50 shadow-green-200";
                  label = "Correct Answer";
                } else if (isSelected) {
                  className += "border-red-600 bg-red-200 shadow-red-300";
                  label = "Your Answer";
                } else {
                  className += "border-slate-300 hover:bg-slate-50 hover:shadow-lg";
                }

                return (
                  <div key={i} className={className}>
                    <div className="flex justify-between items-start">
                      <MathJax inline={false}>
                        <div dangerouslySetInnerHTML={{ __html: opt }} />
                      </MathJax>
                      {label && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isCorrect ? "bg-green-200 text-green-800" : "bg-red-400 text-red-800"
                        }`}>
                          {label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Explanation */}
          {q.explanation && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-6 border-indigo-500 shadow-inner">
              <h3 className="font-bold mb-2 text-indigo-900 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Explanation:
              </h3>
              <MathJax>
                <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
              </MathJax>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex justify-center gap-4 border-t border-slate-300">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-400 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ← Previous
          </button>
          <button
            onClick={next}
            disabled={current === section.questions.length - 1}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Next →
          </button>
        </div>
      
    </MathJaxContext>
  );
}
