// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Eye, CalendarDays, Shield, User, Award } from "lucide-react";

function Dashboard() {
  const [exams, setExams] = useState([]); 
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.email;
userData

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center">
          <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg">Please log in to access your secure dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-base sm:text-lg">Loading your secure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
       

        {exams.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center border border-gray-200">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Activity Yet</h2>
            <p className="text-gray-600 text-sm sm:text-base">Start your first test to see your progress here.</p>
          </div>
        ) : (
          exams.map((exam, examIdx) => (
            <div key={examIdx} className="mb-8 sm:mb-12">
              {/* Exam Header */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="bg-blue-600 rounded-full p-1.5 sm:p-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-blue-800 uppercase tracking-wide">
                  {exam.examType}
                </h2>
              </div>

              {/* Tests List - Single Column Full Width */}
              <div className="space-y-4 sm:space-y-6">
                {exam.tests.map((test, testIdx) => (
                  <div
                    key={testIdx}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Test Header */}
                    <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">
                          {test.testName}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {test.attempts.length}/2 Attempts
                        </span>
                        {test.attempts.length === 2 && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Purchase Info */}
                    {test.purchaseDate && (
                      <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center text-xs sm:text-sm text-gray-600 border-b border-gray-100 bg-white">
                        <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                        <span className="font-medium">Purchased on:</span>{" "}
                        <span className="ml-1">{new Date(test.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Attempts */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      {test.attempts.length === 0 ? (
                        <div className="text-gray-500 text-xs sm:text-sm italic text-center py-4">
                          No attempts yet. Start your test to begin tracking progress.
                        </div>
                      ) : (
                        test.attempts.map((attempt, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-semibold text-gray-800 text-base sm:text-lg">
                                Attempt {attempt.attempt}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                {attempt.status === "completed"
                                  ? `Completed on ${new Date(
                                      attempt.submittedAt
                                    ).toLocaleString()}`
                                  : "Status: Pending"}
                              </div>
                            </div>

                            <button
                              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md w-full sm:w-auto justify-center"
                              onClick={() =>
                                (window.location.href = `/results/${exam.examType.toLowerCase()}/${test.testName}/${attempt.attempt}`)
                              }
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              View Results
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
