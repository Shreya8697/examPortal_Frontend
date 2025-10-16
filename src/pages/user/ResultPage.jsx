// src/pages/ResultPage.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Download, ChevronDown, ChevronUp } from "lucide-react";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

// Helper: Convert seconds to hh:mm:ss or mm:ss
const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}h ${m}m ${s}s`
    : m > 0
    ? `${m}m ${s}s`
    : `${s}s`;
};

export default function ResultPage() {
  const { examType, testName, attempt } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const email =
    location.state?.email ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        return u?.email || localStorage.getItem("userEmail") || null;
      } catch {
        return localStorage.getItem("userEmail") || null;
      }
    })();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/website/exam/results/${examType}/${testName}/${attempt}`,
          { params: { email } }
        );
        setResult(res.data);
      } catch (err) {
        console.error("Error fetching result:", err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [examType, testName, attempt, email]);

  const metrics = useMemo(() => {
    if (!result) return null;
    const sections = result.sections || [];
    let totalQ = 0,
      correct = 0,
      incorrect = 0,
      unattempted = 0;

    sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        totalQ++;
        const sel = q.selected;
        const attempted = sel !== null && typeof sel !== "undefined";
        if (!attempted) unattempted++;
        else if (q.status) correct++;
        else incorrect++;
      });
    });

    return { totalQ, correct, incorrect, unattempted };
  }, [result]);

  const cleanHTML = (html) => ({
    __html: DOMPurify.sanitize(html || ""),
  });

  // ✅ Single open section logic
  const toggleSection = (name) => {
    setOpenSections((prev) => {
      const isAlreadyOpen = prev[name];
      const newState = {};
      if (!isAlreadyOpen) {
        newState[name] = true;
      }
      return newState;
    });
  };

  const   loadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`${examType}_${testName}_attempt${attempt}.pdf`);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-2">Email not found. Please login.</p>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => navigate("/")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading result...
      </div>
    );

  if (!result)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Result not found.
      </div>
    );

  return (
    <MathJaxContext>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto" ref={reportRef}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                className="flex items-center gap-2 text-gray-600"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft /> Back
              </button>
              <h1 className="text-2xl font-semibold mt-3">
                {examType.toUpperCase()} — {result.testName} (Attempt{" "}
                {result.attempt})
              </h1>
              <div className="text-sm text-gray-500">
                Submitted at: {new Date(result.submittedAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="bg-white rounded-lg p-4 shadow text-center">
                <div className="text-sm text-gray-500">Total Score</div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.correct}/{metrics.totalQ}
                </div>
                <div className="text-sm text-gray-500">
                  Time: {formatTime(result.totalTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Section Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {(result.sections || []).map((sec) => {
              const total = sec.questions.length;
              const correct = sec.questions.filter((q) => q.status).length;
              const attempted = sec.questions.filter(
                (q) => q.selected !== null && typeof q.selected !== "undefined"
              ).length;
              const unattempted = total - attempted;

              return (
                <div
                  key={sec.sectionName || sec.name}
                  className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold capitalize">
                        {sec.sectionName || sec.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {total} questions
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        toggleSection(sec.sectionName || sec.name)
                      }
                      className="text-sm text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      Review{" "}
                      {openSections[sec.sectionName || sec.name] ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <div className="text-lg font-bold text-green-600">
                      {correct}/{total} Correct
                    </div>
                    <div className="text-sm text-gray-600">
                      Time: {formatTime(sec.totalTime)}
                    </div>
                  </div>

                  {/* Mini Graph */}
                  <div style={{ height: 80 }} className="mt-2 flex gap-2">
                    {[
                      { label: "Correct", value: correct, color: COLORS[0] },
                      { label: "Incorrect", value: attempted - correct, color: COLORS[1] },
                      { label: "Unattempted", value: unattempted, color: COLORS[2] },
                    ].map((bar, idx) => {
                      const displayValue = bar.value > 0 ? bar.value : 0.5;
                      return (
                        <div key={idx} className="flex-1 cursor-pointer">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[{ name: bar.label, val: displayValue }]}
                              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                              <XAxis hide />
                              <YAxis hide domain={[0, Math.max(correct, attempted - correct, unattempted) || 1]} />
                              <Tooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white p-1 border rounded shadow text-sm">
                                        {bar.label}: {bar.value}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar dataKey="val" fill={bar.color} radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Reviews */}
          {(result.sections || []).map((sec) => (
            <div key={sec.sectionName || sec.name}>
              {openSections[sec.sectionName || sec.name] && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                  <h2 className="font-semibold mb-4">
                    {sec.sectionName || sec.name} — Review
                  </h2>
                  <div className="space-y-3">
                    {sec.questions.map((q) => (
                      <div key={q._id || q.id} className="border rounded p-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Q{q.id} · {q.type}{" "}
                          {examType !== "datainsight" && q.timeTaken > 0 && (
                            <>· Time: {formatTime(q.timeTaken)}</>
                          )}
                        </div>

                        <MathJax>
                          <div
                            dangerouslySetInnerHTML={cleanHTML(q.text)}
                            className="prose max-w-none"
                          />
                        </MathJax>

                        {Array.isArray(q.options) && q.options.length > 0 ? (
                          <div className="mt-2 grid gap-2">
                            {q.options.map((opt, i) => {
                              const isSelected = q.selected === i;
                              const isCorrect = q.correct === i;
                              const base = "p-2 rounded border text-sm";
                              const style = isCorrect
                                ? "border-green-300 bg-green-50"
                                : isSelected
                                ? "border-blue-300 bg-blue-50"
                                : "border-gray-200 bg-white";
                              return (
                                <div key={i} className={`${base} ${style}`}>
                                  <MathJax>
                                    <div
                                      dangerouslySetInnerHTML={cleanHTML(opt)}
                                    />
                                  </MathJax>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {isSelected && !isCorrect && (
                                      <span className="text-red-600">
                                        Your answer
                                      </span>
                                    )}
                                    {isCorrect && (
                                      <span className="text-green-700">
                                        Correct answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm mt-2 italic">
                            No options or prompts to display.
                          </div>
                        )}

                        {q.explanation && (
                          <div className="mt-3 bg-gray-50 p-3 rounded">
                            <div className="text-sm font-semibold">
                              Explanation
                            </div>
                            <MathJax>
                              <div
                                className="text-sm text-gray-700 mt-1"
                                dangerouslySetInnerHTML={cleanHTML(
                                  q.explanation
                                )}
                              />
                            </MathJax>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MathJaxContext>
  );
}
