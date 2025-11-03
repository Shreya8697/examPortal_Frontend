// QuestionRenderer.js
import { MathJax } from "better-react-mathjax";
import React, { useEffect, useState } from "react";

const QuestionRenderer = ({ question, selected = {}, setSelected }) => {
  // --------------------------
  // Update selected answer
  // --------------------------
  const handleSelect = (promptIdx, optionIdx) => {
    setSelected(promptIdx, optionIdx); // parent function merges with questionID
  };

  // Helper to get controlled value
  const getValue = (idx) => {
    return selected[idx] !== undefined ? selected[idx] : "";
  };

  // --------------------------
  // ID 1: GraphicsInterpretation sahi hai
  // --------------------------
  if (question.id === 1) {
  return (
    <div className="flex flex-col xl:flex-row gap-1 bg-gray-100 rounded-lg p-0">
      {/* LEFT SECTION */}
      <div className="xl:w-1/2 bg-white p-5 shadow-md flex flex-col justify-between">
        
        {question.passage && (
          <p className="mb-4 text-gray-800 leading-relaxed">{question.passage}</p>
        )}

        {question.imageLink?.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {question.imageLink.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`graph-${idx}`}
                className="w-full sm:w-1/2 rounded-md object-contain"
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="xl:w-1/2 bg-white p-5 shadow-md">
        
        {question.chartDescription && (
          <p className="mb-4 text-gray-800 leading-relaxed">{question.chartDescription}</p>
        )}

        {question.prompts?.map((p, idx) => {
          const parts = p.statement.split("—");

          return (
            <div key={idx} className="mb-4">
              <p className="font-semibold mb-2 text-gray-800">{parts[0]}</p>

              {/* ✅ Dropdown instead of Buttons */}
              <select
                value={getValue(idx) ?? ""}
                onChange={(e) => handleSelect(idx, Number(e.target.value))}
                className="w-full sm:w-60 border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select an option
                </option>

                {p.options.map((opt, oIdx) => (
                  <option key={oIdx} value={oIdx}>
                    {opt}
                  </option>
                ))}
              </select>

              {/* If there was text after "—", show it */}
              {parts[1] && <p className="text-gray-800 mt-2">{parts[1]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


  // --------------------------
  // ID 2: TwoPartAnalysis
  // --------------------------
  if (question.id === 2) {
  return (
    <div className="space-y-6 p-6 ">
      {question.passage && (
        <p className="mb-4 text-gray-700 text-lg leading-relaxed">{question.passage}</p>
      )}
      <p className="font-bold mb-6 text-gray-900 text-xl">{question.text}</p>

      <div className="overflow-x-auto flex justify-center">
        <table className="w-full max-w-lg border border-gray-300 border-collapse text-sm bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              {Object.keys(question.tableHeadings || {}).map((colKey, idx) => (
                <th
                  key={idx}
                  className="text-center px-6 py-4 border-r border-blue-400 font-bold text-gray-100 uppercase tracking-wide"
                >
                  {question.tableHeadings[colKey]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.options.map((opt, optIdx) => (
              <tr key={optIdx} className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200">
                {/* Left Column */}
                <td
                  className={`border-r border-gray-300 text-center transition-all duration-200 cursor-pointer ${
                    getValue(0) === optIdx
                      ? "bg-green-100 border-green-400 shadow-inner font-semibold text-green-800"
                      : "bg-white hover:bg-blue-50 hover:shadow-sm"
                  }`}
                  onClick={() => handleSelect(0, optIdx)}
                >
                  <div className="px-4 py-3 flex items-center justify-center space-x-2">
                    {getValue(0) === optIdx && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{opt}</span>
                  </div>
                </td>

                {/* Right Column */}
                <td
                  className={`text-center transition-all duration-200 cursor-pointer ${
                    getValue(1) === optIdx
                      ? "bg-green-100 border-green-400 shadow-inner font-semibold text-green-800"
                      : "bg-white hover:bg-blue-50 hover:shadow-sm"
                  }`}
                  onClick={() => handleSelect(1, optIdx)}
                >
                  <div className="px-4 py-3 flex items-center justify-center space-x-2">
                    {getValue(1) === optIdx && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{opt}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

  // --------------------------
  // ID 3: DataSufficiency
  // --------------------------
 if (question.id === 3) {
  return (
      <div className="w-full py-5 bg-white rounded-2xl p-3">
      {/* Main Grid → Mobile vertical, PC side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Question + Instructions */}
        <div>
          {question.text && (
            <p className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold leading-relaxed mb-4">
              {question.text}
            </p>
          )}

          {question.instructions?.map((ins, idx) => (
            <div
              key={idx}
              className="text-gray-800 text-sm sm:text-base bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 mb-3"
            >
              <span className="font-bold text-blue-600 mr-1">({idx + 1}).</span>
              {ins}
            </div>
          ))}
        </div>

        {/* RIGHT: Options */}
        <div className="flex flex-col gap-2 sm:gap-4 mt-0">
          {question.options.map((opt, idx) => {
            const isSelected = getValue(0) === idx;
            return (
              <label
                key={idx}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm sm:text-base
                  ${
                    isSelected
                      ? "bg-green-50 border-green-500 text-green-900 font-semibold shadow-sm"
                      : "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                  }`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={isSelected}
                  onChange={() => handleSelect(0, idx)}
                  className="accent-green-600 mt-1 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
                <div className="flex-1 leading-snug sm:leading-normal text-gray-900">
                  <MathJax inline={false}>{opt}</MathJax>
                </div>
              </label>
            );
          })}
        </div>

      </div>
    </div>
  );
}


 // --------------------------
// ID 4: TableAnalysis
// --------------------------
if (question.id === 4) {
  return (
    //<div className="w-full max-w-6xl mx-auto mt-6 px-3 sm:px-6 py-5 bg-white rounded-2xl ">
    <div className="w-full mt-6 py-5 bg-white rounded-2xl p-6">
      {/* GRID for PC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Question + Instructions + Table */}
        <div>
          {/* Question Text */}
          {question.text && (
            <p className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl leading-relaxed mb-4">
              {question.text}
            </p>
          )}

          {/* Instructions */}
          {question.instructions && (
            <div
              className="bg-blue-50 border-l-4 border-blue-500 text-gray-800 p-3 sm:p-4 rounded-xl shadow-sm text-sm sm:text-base mb-2"
              dangerouslySetInnerHTML={{ __html: question.instructions }}
            />
          )}

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm w-11/12 sm:w-4/5 mx-auto">
  <table className="w-full border-collapse text-xs sm:text-sm bg-white">
    <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <tr>
        {question.tableData.headers.map((h, i) => (
          <th
            key={i}
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-left font-semibold uppercase tracking-wide border-r border-blue-400 last:border-r-0"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {question.tableData.rows.map((row, i) => (
        <tr
          key={i}
          className={`transition duration-200 ${
            i % 2 === 0
              ? "bg-white hover:bg-gray-50"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          {row.map((cell, j) => (
            <td
              key={j}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-800 border-t border-gray-200"
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>

        {/* RIGHT: Prompts Section */}
        <div className="space-y-5 mt-2">
          {question.prompts?.map((p, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
            >
              <p className="font-semibold text-gray-900 text-base sm:text-lg mb-3 leading-snug">
                {p.statement}
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                {p.options.map((opt, oIdx) => {
                  const selected = getValue(idx) === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(idx, oIdx)}
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border-2 text-sm sm:text-base font-medium transition-all duration-200
                        ${
                          selected
                            ? "bg-green-500 text-white border-green-500 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm"
                        }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

  // --------------------------
  // ID 5 & 6: MultiSourceReasoning (Tabs)
  // --------------------------
  if (question.id === 5 || question.id === 6) {
  const [activeTab, setActiveTab] = useState(Object.keys(question.tabs || {})[0] || "");

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-4 sm:p-6 bg-white rounded-2xl  space-y-6">
      {/* Question Text */}
      {question.text && (
        <p className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl leading-relaxed">
          {question.text}
        </p>
      )}

      {/* Tabs Section */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {Object.keys(question.tabs || {}).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-sm ${
              tab === activeTab
                ? "bg-blue-600 text-white shadow-md border border-blue-600"
                : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-gray-800 leading-relaxed shadow-sm text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: question.tabs[activeTab] }}
      />

      {/* Prompts Section */}
      {question.prompts?.map((p, idx) =>
        p.rows ? (
          <div
            key={idx}
            className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm"
          >
            {/* Prompt Title */}
            <p className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">
              {p.statement}
            </p>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm sm:text-base rounded-lg overflow-hidden">
                <tbody>
                  {p.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={`transition duration-200 ${
                        rIdx % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {/* Left Column */}
                      <td className="border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 font-medium text-gray-800 w-1/2">
                        {row.statement}
                      </td>

                      {/* Options Column */}
                      <td className="border border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {row.options.map((opt, oIdx) => {
                            const selected = getValue(rIdx) === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelect(rIdx, oIdx)}
                                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg border-2 text-sm sm:text-base font-medium transition-all duration-200 ${
                                  selected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

  // --------------------------
  // ID 7: MultiSourceReasoning (Tabs + Radio Options)
  // --------------------------
 if (question.id === 7) {
  const [activeTab, setActiveTab] = useState(
    Object.keys(question.tabs || {})[0] || ""
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-4 sm:p-6 bg-white rounded-2xl space-y-6">

      {/* Question Text */}
      {question.text && (
        <p className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl leading-relaxed">
          {question.text}
        </p>
      )}

      {/* Main TWO COLUMN GRID (PC), STACKED (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SECTION (Tabs + Proposal Content) */}
        <div className="space-y-4">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Object.keys(question.tabs || {}).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-sm ${
                  tab === activeTab
                    ? "bg-blue-600 text-white shadow-md border border-blue-600"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content / Proposal */}
          <div
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-gray-800 leading-relaxed shadow-sm text-sm sm:text-base min-h-[300px] lg:min-h-[400px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: question.tabs[activeTab] }}
          />
        </div>

        {/* RIGHT SECTION (OPTIONS) */}
        <div className="space-y-4">

          {question.instructions && (
            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-medium leading-relaxed bg-blue-50 border-l-4 border-blue-600 p-3 rounded-xl">
              {question.instructions}
            </p>
          )}

          {question.options?.map((opt, idx) => {
            const isSelected = getValue(0) === idx;

            return (
              <label
                key={idx}
                className={`w-full rounded-xl p-3 sm:p-4 cursor-pointer flex items-start gap-3 transition-all duration-300 border-2 ${
                  isSelected
                    ? "bg-blue-100 border-blue-600 font-semibold text-blue-800 shadow-sm"
                    : "bg-white border-gray-300 hover:bg-gray-100 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={isSelected}
                  onChange={() => handleSelect(0, idx)}
                  className="accent-blue-600 mt-1 w-4 h-4 sm:w-5 sm:h-5"
                />
                <div className="flex-1 text-sm sm:text-base md:text-lg leading-snug">
                  <MathJax inline={false}>{opt}</MathJax>
                </div>
              </label>
            );
          })}
        </div>

      </div>
    </div>
  );
}

  return <div className="text-center text-gray-500">Question ID {question.id} not designed yet.</div>;
};

export default QuestionRenderer;
