import React, { useState, useEffect, useRef } from "react";
import { MathJaxContext } from "better-react-mathjax";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalculator } from "@fortawesome/free-solid-svg-icons";
import QuestionRenderer from "./QuestionRenderer";
import Calculator from "../../Exams/Calculator";

const DataInsightsSection = ({
  testName,
  sectionKey,
  sectionTitle = "Data Insights",
  timeForSection = 15 * 60,
  onSectionComplete,
  currentSectionIdx,
  totalSections,
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [showInstruction, setShowInstruction] = useState(true);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeForSection);
  const [preTimer, setPreTimer] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  // Refs for timers and submission control
  const timerRef = useRef(null);
  const preTimerRef = useRef(null);
  const hasSubmittedRef = useRef(false); // ✅ Prevent double submission

  const navigate = useNavigate();

  /* -------------------- Prevent Refresh & Back -------------------- */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "You are not allowed to refresh this page before starting the exam!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
      alert("You are not allowed to go back during the exam!");
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /* -------------------- Helper: Format Time -------------------- */
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /* -------------------- Start Section -------------------- */
  const startSection = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) throw new Error("Please login first");

      setShowInstruction(false);
      setStarted(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/data-insights`,
        { params: { email: user.email, examType: "gmat", testName } }
      );

      if (res.data.status === 1) {
        setQuestions(res.data.data || []);
        setCurrentIdx(0);

        const storedAnswers = JSON.parse(
          localStorage.getItem("dataInsightsAnswers") || "{}"
        );
        setSelected(storedAnswers || {});

        setTimeLeft(timeForSection);
        setTimeUp(false);
      } else {
        alert(res.data.message || "Failed to load questions");
      }
    } catch (err) {
      console.error(err);
      alert(
        "Error loading Data Insights: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  /* -------------------- Pre-Timer (Before Start) -------------------- */
  useEffect(() => {
    if (!showInstruction) return;
    preTimerRef.current = setInterval(() => {
      setPreTimer((prev) => {
        if (prev <= 1) {
          clearInterval(preTimerRef.current);
          startSection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(preTimerRef.current);
  }, [showInstruction]);

  /* -------------------- Main Exam Timer -------------------- */
  useEffect(() => {
    if (!started) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeUp(true);
          handleFinalSubmit(); // ⏱️ Auto submit once
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started]);

  /* -------------------- Handle Option Selection -------------------- */
  const handleSelect = (promptIdx, optionIdx) => {
    setSelected((prev) => {
      const currentQId = questions[currentIdx]?.id;
      const updated = {
        ...prev,
        [currentQId]: {
          ...(prev[currentQId] || {}),
          [promptIdx]: optionIdx,
        },
      };
      localStorage.setItem("dataInsightsAnswers", JSON.stringify(updated));
      return updated;
    });
  };

  /* -------------------- Next Button -------------------- */
  const handleNext = async () => {
    const currentQ = questions[currentIdx];
    const currentSelected = selected[currentQ.id] || {};

    if (currentQ.id === 2) {
      if (currentSelected[0] === undefined || currentSelected[1] === undefined) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
    }

    if (currentQ.id === 3) {
      if (currentSelected[0] === undefined) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
    }

    if (
      currentQ.prompts &&
      Object.keys(currentSelected).length < currentQ.prompts.length
    ) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      await handleFinalSubmit();
    }
  };

  /* -------------------- Final Submit -------------------- */
  const handleFinalSubmit = async () => {
    if (hasSubmittedRef.current || submitting) return;
    hasSubmittedRef.current = true;
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const storedAnswers = JSON.parse(
        localStorage.getItem("dataInsightsAnswers") || "{}"
      );

      const answersArray = Object.keys(storedAnswers).map((qId) => {
        const val = storedAnswers[qId];
        if (typeof val === "object" && !Array.isArray(val)) {
          const arr = Object.keys(val).map((k) => val[k]);
          return { questionId: parseInt(qId), selected: arr };
        } else {
          return { questionId: parseInt(qId), selected: val };
        }
      });

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/data-insights/submit`,
        { email: user?.email, examType: "gmat", testName, answers: answersArray }
      );

      localStorage.removeItem("dataInsightsAnswers");
      setStarted(false);
      setFinished(true);
      onSectionComplete?.();
    } catch (err) {
      console.error("Final submit error:", err);
      alert("Failed to submit answers. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- Instruction Screen -------------------- */
  if (showInstruction) {
    return (
      <>
        <div className="w-full bg-blue-600 text-white py-3 shadow-md text-center font-semibold text-lg">
          Section {currentSectionIdx + 1} of {totalSections} — {sectionTitle}
        </div>

        <div className="min-h-screen flex-col font-sans ">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto my-8 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-slate-900">
              {sectionTitle} Section Instructions
            </h2>

            <div className="text-red-600 font-semibold text-lg mt-2">
              Time to begin: {preTimer} sec
            </div>

            <div className="my-6 leading-relaxed text-slate-800">
              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Section Overview
              </h3>
              <p className="mt-2">
                This section contains <strong>7 questions</strong> to be
                completed in <strong>15 minutes</strong>.
              </p>

              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Question Types
              </h3>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Table Analysis:</strong> Analyze data tables and
                  answer questions
                </li>
                <li>
                  <strong>Graphics Interpretation:</strong> Interpret charts and
                  graphs
                </li>
                <li>
                  <strong>Multi-Source Reasoning:</strong> Analyze information
                  from multiple sources
                </li>
                <li>
                  <strong>Two-Part Analysis:</strong> Answer two related
                  questions about data
                </li>
                <li>
                  <strong>Data Sufficiency:</strong> Determine if given data is
                  sufficient to answer questions
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Navigation
              </h3>
              <p className="mt-2">
                Use the <strong>Next</strong> button to move to the next
                question.
                <br />
                The calculator is provided here; you can use it.
              </p>

              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Timer
              </h3>
              <p className="mt-2">
                The <strong>15-minute</strong> timer will start when you begin
                the test.
              </p>
            </div>

            <button
              onClick={startSection}
              className="bg-blue-600 text-white font-semibold text-base py-3 px-6 rounded-md w-full max-w-xs mx-auto block mt-8 hover:bg-blue-800 transition-colors"
            >
              Begin {sectionTitle} <FontAwesomeIcon icon={faArrowRight} beatFade />
            </button>
          </div>
        </div>
      </>
    );
  }

  /* -------------------- Finish Screen -------------------- */
  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full text-center border-t-4 border-blue-600">
          <h1 className="text-3xl font-bold text-blue-700 mb-3">
            Exam Completed!
          </h1>
          <p className="text-slate-700 text-lg mb-6">
            You have successfully finished the GMAT Test. Your answers have been
            securely submitted.
          </p>

          <button
            onClick={() => navigate("/activity")}
            className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-green-700 transition-all"
          >
            View Result
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- Question Screen -------------------- */
  const currentQ = questions[currentIdx];

  return (
    <MathJaxContext>
      <div className="bg-gray-100 flex flex-col pb-20">
        {/* Header */}
        <header className="w-full bg-blue-600 text-white p-2 px-7 flex justify-between items-center shadow-md text-center font-semibold text-lg">
          <div>
            {sectionTitle} — Q{currentIdx + 1}
          </div>

          <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full font-semibold text-blue-800 shadow-inner border border-blue-200">
            <span>⏱</span>
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </header>

        {/* Question */}
        <div className="mx-auto mt-3 mb-3 rounded-xl shadow-md px-2 py-2 bg-white">
          {currentQ && (
            <QuestionRenderer
              question={currentQ}
              selected={selected[currentQ.id] || {}}
              setSelected={handleSelect}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-between items-center px-4 z-[100]">
          <button
            onClick={() => setShowCalc(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4 py-4 shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 text-sm font-medium flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCalculator} className="text-[20px]"/>
            <span className="hidden sm:inline">Calculator</span>
          </button>

          <button
            onClick={handleNext}
            disabled={submitting}
            className={`px-8 py-3 rounded-full font-semibold transition-colors ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {currentIdx === questions.length - 1
              ? submitting
                ? "Submitting..."
                : "Finish"
              : "Next"}
          </button>
        </div>

        {/* Toasts */}
        {showToast && (
          <div className="fixed bottom-24 right-8 bg-blue-500 text-white p-3 rounded-md shadow-md">
            Please select all answers before proceeding
          </div>
        )}
        {timeUp && (
          <div className="fixed bottom-24 right-8 bg-orange-500 text-white p-3 rounded-md shadow-md">
            ⏰ Time's up! Auto-submitting...
          </div>
        )}

        {/* Loader */}
        {submitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white px-6 py-3 rounded-md shadow-md font-semibold text-gray-800">
              Submitting...
            </div>
          </div>
        )}

        {/* Calculator */}
        {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      </div>
    </MathJaxContext>
  );
};

export default DataInsightsSection;
