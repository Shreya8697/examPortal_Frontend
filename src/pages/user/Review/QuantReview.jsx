// VerbalReview.jsx
import React, { useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

export default function VerbalReview({ section, onBack }) {
  const [current, setCurrent] = useState(0);
  const q = section.questions[current];

  const next = () =>
    current < section.questions.length - 1 && setCurrent((c) => c + 1);
  const prev = () => current > 0 && setCurrent((c) => c - 1);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (!q) return null;

  return (
    <MathJaxContext>
      <div className="max-w-[99%] mb-[80px] sm:mb-[100px] mx-auto mt-4 bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-slate-300 overflow-x-hidden">
        {/* Passage */}
        {q.passage && q.passage.trim() !== "" && (
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-gray-50 to-slate-50 p-3 sm:p-4 rounded-lg border-l-6 border-slate-500 shadow-inner overflow-x-auto">
            <h3 className="font-bold mb-2 text-slate-900 flex items-center text-sm sm:text-base">
              Passage:
            </h3>
            <div className="max-w-full break-words whitespace-normal overflow-visible">
              <MathJax>
                <div
                  className="break-words whitespace-normal overflow-visible"
                  dangerouslySetInnerHTML={{ __html: q.passage.trim() }}
                />
              </MathJax>
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-4 text-gray-900 text-sm sm:text-base lg:text-lg leading-relaxed flex items-start">
          <span className="mr-2 font-bold text-indigo-700 text-lg sm:text-xl">{current + 1}.</span>
          <div className="flex-1 min-w-0 break-words whitespace-normal">
            <MathJax>
              <div
                className="break-words whitespace-normal"
                dangerouslySetInnerHTML={{ __html: q.text }}
              />
            </MathJax>
            <div className="mt-2 inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm">
              Time Taken: {formatTime(q.timeTaken)}
            </div>
          </div>
        </div>

        {/* Options */}
        {q.options?.length > 0 && (
          <div className="flex flex-col gap-2 sm:gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isSelected = i === q.selected;
              let label = "";
              let className = "p-2 sm:p-3 rounded-lg border-2 shadow-md transition-all duration-300 break-words whitespace-normal";

              if (isCorrect && isSelected) {
                className += " border-green-500 bg-green-50 shadow-green-200";
                label = "Your Answer (Correct)";
              } else if (isCorrect) {
                className += " border-green-500 bg-green-50 shadow-green-200";
                label = "Correct Answer";
              } else if (isSelected) {
                className += " border-red-600 bg-red-200 shadow-red-300";
                label = "Your Answer";
              } else {
                className += " border-slate-300 hover:bg-slate-50 hover:shadow-lg";
              }

              return (
                <div key={i} className={className}>
                  <div className="flex justify-between items-start gap-2">
                    <MathJax>
                      <div
                        className="break-words whitespace-normal overflow-visible"
                        dangerouslySetInnerHTML={{ __html: opt }}
                      />
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
          <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border-l-6 border-indigo-500 shadow-inner overflow-x-auto">
            <h3 className="font-bold mb-2 text-indigo-900 flex items-center text-sm sm:text-base">
              Explanation:
            </h3>
            <div className="max-w-full break-words whitespace-normal overflow-visible">
              <MathJax>
                <div
                  className="break-words whitespace-normal overflow-visible"
                  dangerouslySetInnerHTML={{ __html: q.explanation }}
                />
              </MathJax>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 sm:py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex justify-center gap-3 sm:gap-4 border-t border-slate-300">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-slate-300 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-400 font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          disabled={current === section.questions.length - 1}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          Next →
        </button>
      </div>
    </MathJaxContext>
  );
}
