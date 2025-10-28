// DataInsightReview.jsx
import React, { useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

export default function DataInsightReview({ section }) {
  const [current, setCurrent] = useState(0);
  const q = section.questions[current];

  const next = () =>
    current < section.questions.length - 1 && setCurrent((c) => c + 1);
  const prev = () => current > 0 && setCurrent((c) => c - 1);

  if (!q) return null;

  // Common rendering for passage, images, explanation
  const renderPassage = () => (
    q.passage && (
      <div className="mb-6 bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-l-6 border-slate-500 shadow-inner">
        <h3 className="font-bold mb-2 text-slate-900 flex items-center">
          Passage:
        </h3>
        <MathJax>
          <div dangerouslySetInnerHTML={{ __html: q.passage }} />
        </MathJax>
      </div>
    )
  );

  const renderImages = () => (
    q.imageLink && q.imageLink.length > 0 && (
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {q.imageLink.map((src, idx) => (
          <div
            key={idx}
            className="border p-2 rounded-lg shadow-sm bg-white flex justify-center items-center"
          >
            <img
              src={src}
              alt={`Question ${q.id} Image ${idx}`}
              className="max-h-56 object-contain w-full"
            />
          </div>
        ))}
      </div>
    )
  );

  const renderExplanation = () => (
    q.explanation && (
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-6 border-indigo-500 shadow-inner">
        <h3 className="font-bold mb-2 text-indigo-900 flex items-center">
          Explanation:
        </h3>
        <MathJax>
          <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
        </MathJax>
      </div>
    )
  );

  const renderQuestionText = () => (
    <div className="mb-4 text-gray-900 text-base sm:text-lg leading-relaxed flex items-start">
      <span className="mr-2 font-bold text-indigo-700 text-xl">
        {current + 1}.
      </span>
      <div className="flex-1">
        <MathJax>
          <div dangerouslySetInnerHTML={{ __html: q.text }} />
        </MathJax>
      </div>
    </div>
  );

  // ID-specific rendering
  const renderQuestionContent = () => {
    if (q.id === 1) {
      // GraphicsInterpretation: Render prompts as drop-down selects
      return (
        <>
          {q.status === null && <div className="text-end text-red-600 font-semibold mb-4">Unattempt</div>}
          {renderPassage()}
          {renderImages()}
          {renderQuestionText()}
          <div className="space-y-4">
            {q.prompts.map((p, idx) => {
              const selectedIndex = q.selected?.[idx];
              const correctIndex = q.correct?.[idx];
              return (
                <div key={idx} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <div className="text-gray-700 font-medium mb-2">
                    <MathJax>
                      <div dangerouslySetInnerHTML={{ __html: p.statement }} />
                    </MathJax>
                  </div>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedIndex || ""}
                    disabled
                  >
                    <option value="">Select an option</option>
                    {p.options.map((opt, i) => (
                      <option key={i} value={i}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {selectedIndex !== undefined && (
                    <div className="mt-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        selectedIndex === correctIndex ? "bg-green-200 text-green-800" : "bg-red-400 text-red-800"
                      }`}>
                        {selectedIndex === correctIndex ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  )}
                  {p.explanation && (
                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
                      <MathJax>
                        <div dangerouslySetInnerHTML={{ __html: p.explanation }} />
                      </MathJax>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    } else if (q.id === 2) {
      // TwoPartAnalysis
      return (
        <>
          {q.status === null && <div className="text-end text-red-600 font-semibold mb-4">Unattempt</div>}
          {renderPassage()}
          {renderQuestionText()}
          <div className="mb-6 flex gap-8">
            {/* Column 1 */}
            <div className="flex-1">
              <h4 className="font-bold mb-2 text-gray-900">{q.tableHeadings.column1}</h4>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correct?.[0];
                  const isSelected = i === q.selected?.[0];
                  let className = "p-2 rounded-lg border transition-all duration-300";
                  if (isCorrect && isSelected) className += " border-green-500 bg-green-50 shadow-green-200";
                  else if (isCorrect) className += " border-green-500 bg-green-50 shadow-green-200";
                  else if (isSelected) className += " border-red-500 bg-red-50 shadow-red-200";
                  else className += " border-gray-200 hover:bg-gray-100";
                  return <div key={i} className={className}>{opt}</div>;
                })}
              </div>
            </div>
            {/* Column 2 */}
            <div className="flex-1">
              <h4 className="font-bold mb-2 text-gray-900">{q.tableHeadings.column2}</h4>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correct?.[1];
                  const isSelected = i === q.selected?.[1];
                  let className = "p-2 rounded-lg border transition-all duration-300";
                  if (isCorrect && isSelected) className += " border-green-500 bg-green-50 shadow-green-200";
                  else if (isCorrect) className += " border-green-500 bg-green-50 shadow-green-200";
                  else if (isSelected) className += " border-red-500 bg-red-50 shadow-red-200";
                  else className += " border-gray-200 hover:bg-gray-100";
                  return <div key={i} className={className}>{opt}</div>;
                })}
              </div>
            </div>
          </div>
        </>
      );
    } else if (q.id === 3) {
      // DataSufficiency
      return (
        <>
          {q.status === null && <div className="text-end text-red-600 font-semibold mb-4">Unattempt</div>}
          {renderQuestionText()}
          <div className="mb-4 text-gray-700">
            {q.instructions.map((inst, idx) => (
              <div key={idx} className="mb-2">
                <strong>Statement {idx + 1}:</strong> {inst}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let className = "p-3 rounded-lg border transition-all duration-300";
              let label = "";
              if (i === q.correct && i === q.selected) {
                className += " border-green-500 bg-green-50 shadow-green-200";
                label = "Your Answer (Correct)";
              } else if (i === q.correct) {
                className += " border-green-500 bg-green-50 shadow-green-200";
                label = "Correct Answer";
              } else if (i === q.selected) {
                className += " border-red-500 bg-red-50 shadow-red-200";
                label = "Your Answer";
              } else {
                className += " border-gray-200 hover:bg-gray-100";
              }
              return (
                <div key={i} className={className}>
                  <div className="flex justify-between items-start">
                    <MathJax>
                      <div dangerouslySetInnerHTML={{ __html: opt }} />
                    </MathJax>
                    {label && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        i === q.correct ? "bg-green-200 text-green-800" : "bg-red-400 text-red-800"
                      }`}>
                        {label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    } else if (q.id === 4) {
      // TableAnalysis
      return (
        <>
          {q.status === null && <div className="text-end text-red-600 font-semibold mb-4">Unattempt</div>}
          {renderQuestionText()}
          <div className="mb-4 text-gray-700">
            <MathJax>
              <div dangerouslySetInnerHTML={{ __html: q.instructions }} />
            </MathJax>
          </div>
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {q.tableData.headers.map((header, idx) => (
                    <th key={idx} className="px-4 py-2 border border-gray-300 bg-gray-50 text-left text-sm font-medium text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {q.tableData.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-2 border border-gray-300 text-sm text-gray-900">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-4">
            {q.prompts.map((p, idx) => {
              const selectedIndex = q.selected?.[idx];
              const correctIndex = q.correct?.[idx];
              return (
                <div key={idx} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <div className="text-gray-700 font-medium mb-2">
                    <MathJax>
                      <div dangerouslySetInnerHTML={{ __html: p.statement }} />
                    </MathJax>
                  </div>
                  <div className="flex gap-2">
                    {p.options.map((opt, i) => {
                      let className = "px-3 py-1 rounded border";
                      if (i === correctIndex && i === selectedIndex) className += " border-green-500 bg-green-50";
                      else if (i === correctIndex) className += " border-green-500 bg-green-50";
                      else if (i === selectedIndex) className += " border-red-500 bg-red-50";
                      else className += " border-gray-200";
                      return <button key={i} className={className}>{opt}</button>;
                    })}
                  </div>
                  {p.explanation && (
                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
                      <MathJax>
                        <div dangerouslySetInnerHTML={{ __html: p.explanation }} />
                      </MathJax>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    } else if ([5, 6].includes(q.id)) {
  // MultiSourceReasoning (ID 5 and 6)
  return (
    <>
      {/* Attempt status */}
      {q.status === null && (
        <div className="text-end text-red-600 font-semibold mb-4">Unattempted</div>
      )}

      {/* Question text */}
      {renderQuestionText()}

      {/* Tabs Section */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 flex-wrap">
          {Object.keys(q.tabs).map((tabName) => (
            <div
              key={tabName}
              className="px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-t-md border-x border-t border-gray-200 mr-1 mt-1"
            >
              {tabName}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {Object.entries(q.tabs).map(([tabName, content]) => (
            <div key={tabName} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h4 className="font-bold text-indigo-900 mb-2">{tabName}</h4>
              <MathJax>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </MathJax>
            </div>
          ))}
        </div>
      </div>

      {/* Prompts Table */}
      <div className="space-y-6">
        {q.prompts.map((p, idx) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="text-gray-800 font-semibold mb-3">
              <MathJax>
                <div dangerouslySetInnerHTML={{ __html: p.statement }} />
              </MathJax>
            </div>

            {/* Table of rows */}
            <div className="space-y-3">
              {p.rows.map((row, rowIdx) => {
                const correctIndex = row.options.indexOf(row.correctAnswer);
                const rowSelected = q.selected?.[rowIdx]; // From API array
                return (
                  <div
                    key={rowIdx}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-2"
                  >
                    <span className="text-gray-700">{row.statement}</span>
                    <div className="flex gap-2">
                      {row.options.map((opt, optIdx) => {
                        let className =
                          "px-3 py-1 rounded border text-sm font-medium";
                        if (optIdx === correctIndex && optIdx === rowSelected)
                          className +=
                            " border-green-600 bg-green-50 text-green-800";
                        else if (optIdx === correctIndex)
                          className +=
                            " border-green-500 bg-green-50 text-green-700";
                        else if (optIdx === rowSelected)
                          className +=
                            " border-red-500 bg-red-50 text-red-700";
                        else className += " border-gray-200 text-gray-600";
                        return (
                          <button key={optIdx} className={className} disabled>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      {/* {renderExplanation()} */}
    </>
  );
}
 else if (q.id === 7) {
      // MultiSourceReasoning id 7
      return (
        <>
          {q.status === null && <div className="text-end text-red-600 font-semibold mb-4">Unattempt</div>}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              {Object.keys(q.tabs).map((tabName) => (
                <button key={tabName} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600">
                  {tabName}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {Object.entries(q.tabs).map(([tabName, content]) => (
                <div key={tabName} className="mb-4">
                  <h4 className="font-bold text-indigo-900">{tabName}</h4>
                  <MathJax>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </MathJax>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 text-gray-700">
            <MathJax>
              <div dangerouslySetInnerHTML={{ __html: q.instructions }} />
            </MathJax>
          </div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let className = "p-3 rounded-lg border transition-all duration-300";
              let label = "";
              if (i === q.correct && i === q.selected) {
                className += " border-green-500 bg-green-50 shadow-green-200";
                label = "Your Answer (Correct)";
              } else if (i === q.correct) {
                className += " border-green-500 bg-green-50 shadow-green-200";
                label = "Correct Answer";
              } else if (i === q.selected) {
                className += " border-red-500 bg-red-50 shadow-red-200";
                label = "Your Answer";
              } else {
                className += " border-gray-200 hover:bg-gray-100";
              }
              return (
                <div key={i} className={className}>
                  <div className="flex justify-between items-start">
                    <MathJax>
                      <div dangerouslySetInnerHTML={{ __html: opt }} />
                    </MathJax>
                    {label && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        i === q.correct ? "bg-green-200 text-green-800" : "bg-red-400 text-red-800"
                      }`}>
                        {label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    } else {
      // fallback
      return <div>Question type not supported.</div>;
    }
  };

  return (
    <MathJaxContext>
      <div className="max-w-[99%] mb-[100px] mx-auto mt-4 bg-white p-6 rounded-xl shadow-xl border border-slate-300">
        {renderQuestionContent()}
        {renderExplanation()}
      </div>

      

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
