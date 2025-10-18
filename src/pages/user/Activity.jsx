// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Eye, CalendarDays } from "lucide-react";

function Dashboard() {
  const [exams, setExams] = useState([]); 
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.email;

  useEffect(() => {
    if (!email) return;

    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/website/exam/results/summary/${email}`
        );

        const grouped = res.data.reduce((acc, item) => {
          if (!acc[item.examType]) acc[item.examType] = [];
          acc[item.examType].push(item);
          return acc;
        }, {});

        const groupedArray = Object.entries(grouped).map(([examType, tests]) => ({
          examType,
          tests,
        }));

        setExams(groupedArray);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [email]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please login to view your dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Exam Dashboard
        </h1>

        {exams.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
            No activity yet. Start your first test to see it here.
          </div>
        ) : (
          exams.map((exam, examIdx) => (
            <div key={examIdx} className="mb-10">
              {/* Exam Header */}
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 uppercase">
                {exam.examType}
              </h2>

              {/* Tests List - Single Column Full Width */}
              <div className="space-y-6">
                {exam.tests.map((test, testIdx) => (
                  <div
                    key={testIdx}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                  >
                    {/* Test Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                          {test.testName}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {test.attempts.length}/2 Attempts
                      </span>
                    </div>

                    {/* Purchase Info */}
                    {test.purchaseDate && (
                      <div className="px-5 py-2 flex items-center text-sm text-gray-500 border-b border-gray-100 bg-white">
                        <CalendarDays className="w-4 h-4 mr-2 text-green-600" />
                        Purchased on{" "}
                        {new Date(test.purchaseDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Attempts */}
                    <div className="p-5 space-y-3">
                      {test.attempts.length === 0 ? (
                        <div className="text-gray-500 text-sm italic">
                          No attempts yet.
                        </div>
                      ) : (
                        test.attempts.map((attempt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div>
                              <div className="font-medium text-gray-800">
                                Attempt {attempt.attempt}
                              </div>
                              <div className="text-sm text-gray-500">
                                {attempt.status === "completed"
                                  ? `Completed on ${new Date(
                                      attempt.submittedAt
                                    ).toLocaleString()}`
                                  : "Pending"}
                              </div>
                            </div>

                            <button
                              className="flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              onClick={() =>
                                (window.location.href = `/results/${exam.examType.toLowerCase()}/${test.testName}/${attempt.attempt}`)
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
