import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Eye, Download } from "lucide-react";

function Dashboard() {
  const [tests, setTests] = useState([]); // Tests state
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.email;

  // Fetch dashboard summary
  useEffect(() => {
    if (!email) return; // Guard if user not logged in

    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/website/exam/results/summary/${email}`
        );
        // Filter only GMAT exams
        const gmatTests = res.data.filter((item) => item.examType === "gmat");
        setTests(gmatTests);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [email]);

  // Handle user not logged in
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please login to view your dashboard.
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My GMAT Dashboard</h1>

        {tests.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
            No GMAT tests attempted yet.
          </div>
        ) : (
          tests.map((test, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md mb-6 border border-gray-200"
            >
              {/* Test Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800 capitalize">
                    {test.testName}
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  Attempts: {test.attempts.length}/2
                </span>
              </div>

              {/* Test Attempts */}
              <div className="p-6 space-y-4">
                {test.attempts.map((attempt, attemptIdx) => (
                  <div
                    key={attemptIdx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
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

                    <div className="flex space-x-3">
                      <button
                        className="flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        onClick={() =>
                          window.location.href = `/results/gmat/${test.testName}/${attempt.attempt}`
                        }
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Result
                      </button>
                      <button
                        className="flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={() => alert("Download functionality coming soon")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
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
