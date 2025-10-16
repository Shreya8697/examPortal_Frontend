// QuestionRenderer.js
import React, { useState } from "react";

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
      <div>
        {question.passage && <p className="mb-4">{question.passage}</p>}
        <div className="flex gap-4 mb-4">
          {question.imageLink?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`graph-${idx}`}
              className="w-1/2 border rounded-md"
            />
          ))}
        </div>
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
  // ID 2: TwoPartAnalysis
  // --------------------------
  if (question.id === 2) {
    return (
      <div>
        {question.passage && <p className="mb-2">{question.passage}</p>}
        <p className="font-semibold mb-4">{question.text}</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(question.tableHeadings || {}).map((colKey, idx) => (
            <div key={idx}>
              <label className="font-medium">{question.tableHeadings[colKey]}</label>
              <select
                value={getValue(idx)}
                onChange={(e) => handleSelect(idx, parseInt(e.target.value))}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Select</option>
                {question.options.map((opt, oIdx) => (
                  <option key={oIdx} value={oIdx}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------
  // ID 3: DataSufficiency
  // --------------------------
  if (question.id === 3) {
    return (
      <div>
        {question.text && <p className="mb-2 font-semibold">{question.text}</p>}
        {question.instructions?.map((ins, idx) => (
          <p key={idx} className="text-gray-700 mb-2">{ins}</p>
        ))}
        <select
          value={getValue(0)}
          onChange={(e) => handleSelect(0, parseInt(e.target.value))}
          className="border rounded-md p-2 w-full"
        >
          <option value="">Select</option>
          {question.options.map((opt, idx) => (
            <option key={idx} value={idx}>
              {opt}
            </option>
          ))}
        </select>
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
      <div>
        {question.text && <p className="mb-2 font-semibold">{question.text}</p>}
        {question.instructions && <p className="mb-4">{question.instructions}</p>}
        <select
          value={getValue(0)}
          onChange={(e) => handleSelect(0, parseInt(e.target.value))}
          className="border rounded-md p-2 w-full"
        >
          <option value="">Select</option>
          {question.options?.map((opt, idx) => (
            <option key={idx} value={idx}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return <div>Question ID {question.id} not designed yet.</div>;
};

export default QuestionRenderer;
