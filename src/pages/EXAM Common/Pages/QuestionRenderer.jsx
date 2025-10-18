// QuestionRenderer.js
import { MathJax } from "better-react-mathjax";
import React, { useEffect, useState } from "react";

const QuestionRenderer = ({ question, selected = {}, setSelected }) => {
  // --------------------------
  // Update selected answer
  // --------------------------
  const handleSelect = (promptIdx, optionIdx) => {
    setSelected(promptIdx, optionIdx); // parent function me questionID ke saath merge hota hai
  };
  
  

  // Helper to get controlled value
  const getValue = (idx) => {
    return selected[idx] !== undefined ? selected[idx] : "";
  };

  // --------------------------
  // ID 1: GraphicsInterpretation
  // --------------------------
  if (question.id === 1) {
    return (
    <div className="flex flex-col xl:flex-row gap-7 bg-gray-100  rounded-lg">
  {/* LEFT SECTION */}
  <div className="xl:w-1/2 bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
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
            className="w-full sm:w-1/2 rounded-md object-contain "
          />
        ))}
      </div>
    )}
  </div>

  {/* RIGHT SECTION */}
  <div className="xl:w-1/2 bg-white p-4 rounded-lg shadow-md">
  {question.chartDescription && (
      <p className="mb-4 text-gray-800 leading-relaxed">{question.chartDescription}</p>
    )}
    {question.prompts?.map((p, idx) => {
      // Statement ko split karte hain "—" pe taaki inline dropdown dikh sake
      const parts = p.statement.split("—");
      return (
        <div key={idx} className="mb-4">
          <p className="font-semibold mb-2 text-gray-800">
            {parts[0]}
            <select
              value={getValue(idx)}
              onChange={(e) => handleSelect(idx, parseInt(e.target.value))}
              className="border rounded-md px-2 py-1 mx-2 inline-block"
            >
              <option value="">Select</option>
              {p.options.map((opt, oIdx) => (
                <option key={oIdx} value={oIdx}>
                  {opt}
                </option>
              ))}
            </select>
            {parts[1]}
          </p>
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
  // --------------------------
// ID 2: TwoPartAnalysis  ✅ UPDATED
// --------------------------
if (question.id === 2) {
  return (
    <div>
  {question.passage && <p className="mb-2">{question.passage}</p>}
  <p className="font-semibold mb-4">{question.text}</p>

  <div className="overflow-x-auto flex justify-center">
    <table className="w-[30%] border  border-gray-300 border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100 ">
          {Object.keys(question.tableHeadings || {}).map((colKey, idx) => (
            <th
              key={idx}
              className="text-center px-4 py-2 border border-gray-300 font-semibold"
            >
              {question.tableHeadings[colKey]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {question.options.map((opt, optIdx) => (
          <tr key={optIdx}>
            {/* Left Column (Engineering) */}
            <td
              className={`border border-gray-300 text-center  transition ${
                getValue(0) === optIdx
                  ? "bg-blue-300 font-semibold"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <button
                onClick={() => handleSelect(0, optIdx)}
                className="w-full text-left px-3 py-2"
              >
                {opt}
              </button>
            </td>

            {/* Right Column (Design) */}
            <td
              className={`border text-center border-gray-300 transition ${
                getValue(1) === optIdx
                  ? "bg-blue-300 font-semibold"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <button
                onClick={() => handleSelect(1, optIdx)}
                className="w-full text-left px-3 py-2"
              >
                {opt}
              </button>
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
    <div className="w-[100%] mx-auto mt-4 space-y-4">
      {/* Question Text */}
      {question.text && (
        <p className="text-gray-800 text-base sm:text-lg">{question.text}</p>
      )}

      {/* Instructions */}
      {question.instructions?.map((ins, idx) => (
        <p key={idx} className="font-semibold text-gray-700">
          <span className="font-semibold">({idx + 1}). </span>
          {ins}
        </p>
      ))}

      {/* Options */}
      <div className=" flex flex-col gap-4">
        {question.options.map((opt, idx) => {
          const isSelected = getValue(0) === idx;
          return (
            <label
              key={idx}
              className={`w-[100%] rounded-lg p-3 cursor-pointer flex items-start gap-2 transition-all duration-200 border ${
                isSelected
                  ? "bg-blue-100 border-blue-500 font-semibold text-blue-800"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={isSelected}
                onChange={() => handleSelect(0, idx)}
                className="accent-blue-600 mt-1"
              />
              <MathJax inline={false}>{opt}</MathJax>
            </label>
          );
        })}
      </div>
    </div>
  );
}


  // --------------------------
  // ID 4: TableAnalysis
  // --------------------------
  if (question.id === 4) {
    return (
      <div>
        {question.text && <p className="mb-2 font-semibold">{question.text}</p>}
        <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
          <thead className="bg-gray-100">
            <tr>
              {question.tableData.headers.map((h, i) => (
                <th key={i} className="border px-3 py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.tableData.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border px-3 py-1">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {question.prompts?.map((p, idx) => (
          <div key={idx} className="mb-3">
            <p className="font-semibold mb-1">{p.statement}</p>
            <select
              value={getValue(idx)}
              onChange={(e) => handleSelect(idx, parseInt(e.target.value))}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select</option>
              {p.options.map((opt, oIdx) => (
                <option key={oIdx} value={oIdx}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  // --------------------------
  // ID 5 & 6: MultiSourceReasoning (Tabs)
  // --------------------------
  if (question.id === 5 || question.id === 6) {
    const [activeTab, setActiveTab] = useState(Object.keys(question.tabs || {})[0] || "");

    return (
      <div>
        {question.text && <p className="mb-2 font-semibold">{question.text}</p>}

        <div className="flex gap-2 mb-4">
          {Object.keys(question.tabs || {}).map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 rounded-md ${
                tab === activeTab ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          className="bg-gray-50 p-4 mb-4 border rounded-md"
          dangerouslySetInnerHTML={{ __html: question.tabs[activeTab] }}
        />

        {question.prompts?.map((p, idx) =>
          p.rows ? (
            <div key={idx} className="mb-4">
              <p className="font-semibold mb-2">{p.statement}</p>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <tbody>
                  {p.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border px-2 py-1">{row.statement}</td>
                      <td className="border px-2 py-1">
                        <select
                          value={getValue(rIdx)}
                          onChange={(e) => handleSelect(rIdx, parseInt(e.target.value))}
                          className="border rounded-md p-1 w-full"
                        >
                          <option value="">Select</option>
                          {row.options.map((opt, oIdx) => (
                            <option key={oIdx} value={oIdx}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null
        )}
      </div>
    );
  }

  // --------------------------
  // ID 7: MultiSourceReasoning (Options)
  // --------------------------
  if (question.id === 7) {
    return (
    <div className="w-[100%] mx-auto mt-4 space-y-4">
  {/* Question Text */}
  {question.text && (
    <p className="text-gray-800 text-base sm:text-lg font-semibold">
      {question.text}
    </p>
  )}

  {/* Instructions */}
  {question.instructions && (
    <p className="text-gray-700">{question.instructions}</p>
  )}

  {/* Options as Radio Buttons */}
  <div className="flex flex-col gap-4 mt-2">
    {question.options?.map((opt, idx) => {
      const isSelected = getValue(0) === idx;
      return (
        <label
          key={idx}
          className={`w-full rounded-lg p-3 cursor-pointer flex items-start gap-2 transition-all duration-200 border ${
            isSelected
              ? "bg-blue-100 border-blue-500 font-semibold text-blue-800"
              : "hover:bg-gray-100 border-gray-300"
          }`}
        >
          <input
            type="radio"
            name={`q-${question.id}`}
            checked={isSelected}
            onChange={() => handleSelect(0, idx)}
            className="accent-blue-600 mt-1"
          />
          <MathJax inline={false}>{opt}</MathJax>
        </label>
      );
    })}
  </div>
</div>


    );
  }

  return <div>Question ID {question.id} not designed yet.</div>;
};

export default QuestionRenderer;
