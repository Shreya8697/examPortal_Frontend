import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { MathJaxContext } from "better-react-mathjax";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ArrowLeft, CheckCircle, XCircle, Clock, Target, TrendingUp } from "lucide-react";

const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export default function ResultPage() {
  const { examType, testName, attempt } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  useEffect(() => {
    if (!email) return;
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/website/exam/results/${examType}/${testName}/${attempt}?email=${email}`
        );
        setResult(res.data);
      } catch (err) {
        console.error("❌ Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [examType, testName, attempt, email, BASE_URL]);

  // --- Overall Metrics ---
  const metrics = useMemo(() => {
    if (!result) return null;
    let totalQ = 0,
      correct = 0,
      incorrect = 0,
      unattempted = 0,
      totalTime = 0;
    (result.sections || []).forEach((sec) => {
      (sec.questions || []).forEach((q) => {
        totalQ++;
        totalTime += q.timeTaken || 0;
        if (q.status === true) correct++;
        else if (q.status === false) incorrect++;
        else unattempted++;
      });
    });
    const accuracy = totalQ ? ((correct / totalQ) * 100).toFixed(1) : 0;
    return { totalQ, correct, incorrect, unattempted, totalTime, accuracy };
  }, [result]);

  // --- Section-wise data for chart ---
  const sectionAccuracy = useMemo(() => {
    if (!result) return [];
    return (result.sections || []).map((sec) => {
      const total = sec.questions?.length || 0;
      const correct = sec.questions?.filter((q) => q.status === true).length || 0;
      const accuracy = total ? ((correct / total) * 100).toFixed(1) : 0;
      return {
        name: sec.name || sec.sectionName,
        accuracy: parseFloat(accuracy),
        correct,
        total,
      };
    });
  }, [result]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading results...</p>
        </div>
      </div>
    );

  if (!result)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-xl text-gray-700 mb-4">⚠️ No result found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <MathJaxContext>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {examType.toUpperCase()} Result
              </h1>
              <p className="text-gray-600 mt-1">{testName} - Attempt {attempt}</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-green-100 text-green-800 p-6 rounded-2xl shadow-sm border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={24} />
                <p className="text-sm font-medium">Correct</p>
              </div>
              <p className="text-3xl font-bold">{metrics.correct}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 text-red-800 p-6 rounded-2xl shadow-sm border border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <XCircle size={24} />
                <p className="text-sm font-medium">Incorrect</p>
              </div>
              <p className="text-3xl font-bold">{metrics.incorrect}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 p-6 rounded-2xl shadow-sm border border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={24} />
                <p className="text-sm font-medium">Unattempted</p>
              </div>
              <p className="text-3xl font-bold">{metrics.unattempted}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 p-6 rounded-2xl shadow-sm border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Target size={24} />
                <p className="text-sm font-medium">Total Questions</p>
              </div>
              <p className="text-3xl font-bold">{metrics.totalQ}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 p-6 rounded-2xl shadow-sm border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} />
                <p className="text-sm font-medium">Overall Accuracy</p>
              </div>
              <p className="text-3xl font-bold">{metrics.accuracy}%</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 p-6 rounded-2xl shadow-sm border border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={24} />
                <p className="text-sm font-medium">Total Time</p>
              </div>
              <p className="text-3xl font-bold">{formatTime(result.totalTime)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Overall Distribution */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-inner border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target size={20} />
                Overall Distribution
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={[
                    { name: "Correct", value: metrics.correct, color: "#10b981" },
                    { name: "Incorrect", value: metrics.incorrect, color: "#ef4444" },
                    { name: "Unattempted", value: metrics.unattempted, color: "#f59e0b" },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 21]} allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Section-wise Correct Answers */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-inner border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Section-wise Correct Answers
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sectionAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 7]} allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="correct" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section Details */}
          <div className="space-y-6">
            {result.sections.map((section, index) => {
              const total = section.questions?.length || 0;
              const correct = section.questions?.filter((q) => q.status === true).length || 0;
              const accuracy = total ? ((correct / total) * 100).toFixed(1) : 0;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.name || section.sectionName}
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Time Spent: {formatTime(section.totalTime)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-4">
                    <p className="flex items-center gap-2">
                      <Target size={16} />
                      <b>Questions:</b> {total}
                    </p>
                    <p className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      <b>Accuracy:</b> {accuracy}%
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      <b>Correct:</b> {correct}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() =>
                        navigate(
                          `/review/${examType}/${testName}/${attempt}/${encodeURIComponent(section.name || section.sectionName)}`,
                          { state: { email } }
                        )
                      }
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      Review Section
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}
