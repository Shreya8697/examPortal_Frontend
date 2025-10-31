import React, { useState, useEffect, useRef } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const QuantSection = ({
  sessionId,
  setSessionId,
  testName,
  sectionKey,
  sectionTitle,
  timeForSection = 15 * 60,
  onSectionComplete,
  currentSectionIdx,
  totalSections,
}) => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [showInstruction, setShowInstruction] = useState(true);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeForSection);
  const [preTimer, setPreTimer] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [sessionIdState, setSessionIdState] = useState(sessionId || null);
  const [showToast, setShowToast] = useState(false);

  const preTimerRef = useRef(null);
  const timerRef = useRef(null);
  const sectionStartedOnceRef = useRef(false); // ✅ Important fix

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "You are not allowed to refresh this page before starting the exam!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

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

  useEffect(() => {
    setSessionIdState(sessionId || null);
  }, [sessionId]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startSection = async () => {
    if (sectionStartedOnceRef.current) return; // ✅ Double call stop
    sectionStartedOnceRef.current = true;
    clearInterval(preTimerRef.current);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) throw new Error("User not logged in");

      const payload = {
        email: user.email,
        examType: "gmat",
        testName,
        section: sectionKey,
      };
      if (sessionIdState) payload.resumeSessionId = sessionIdState;

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/start`,
        payload
      );

      const q = res.data?.question || null;
      const sid = res.data?.sessionId || null;

      if (sid) {
        setSessionIdState(sid);
        if (typeof setSessionId === "function") setSessionId(sid);
      }

      if (q) {
        setQuestion({
          id: q.id ?? null,
          text: q.text ?? "",
          options: Array.isArray(q.options) ? q.options : [],
          type: q.type ?? "single",
        });
      }

      setShowInstruction(false);
      setStarted(true);
      setSelected(null);
      setQuestionNumber(1);
      setTimeLeft(timeForSection);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  // ✅ START COUNTDOWN → auto start only once
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

  // ✅ Main exam timer
  useEffect(() => {
    if (!started) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started]);

  const handleAutoSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/submit`,
        {
          sessionId: sessionIdState,
          section: sectionKey,
          autoSubmit: true,
        }
      );
      setStarted(false);
      onSectionComplete?.();
    } catch (err) {
      console.error("Auto submit error:", err);
    }
  };

  const handleSelect = (idx) => setSelected(idx);

  const handleSubmit = async () => {
    if (selected === null) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/submit`,
        {
          sessionId: sessionIdState,
          section: sectionKey,
          questionId: question.id,
          selected,
        }
      );

      if (res.data.finished || !res.data.nextQuestion) {
        clearInterval(timerRef.current);
        setStarted(false);
        onSectionComplete?.();
      } else {
        const nq = res.data.nextQuestion || {};
        setQuestion({
          id: nq.id ?? null,
          text: nq.text ?? "",
          options: Array.isArray(nq.options) ? nq.options : [],
          type: nq.type ?? "single",
        });
        setSelected(null);
        setQuestionNumber((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting answer: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ UI remains EXACT SAME
  if (showInstruction) {
    return (
      <>
        <div className="w-full bg-blue-600 text-white py-3 px-6 shadow-md text-center font-semibold text-lg">
          Section {currentSectionIdx + 1} of {totalSections} — {sectionTitle}
        </div>

        <div className="min-h-screen flex flex-col font-sans bg-slate-50">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto my-8">
            <h2 className="text-2xl font-semibold text-slate-800">
              {sectionTitle} Section Instructions
            </h2>
            <div className="text-red-600 font-semibold text-lg mt-2">
              Time to begin: {preTimer} sec
            </div>
            <div className="my-6 leading-relaxed text-slate-700">
              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Section Overview
              </h3>
              <p className="mt-2">
                This section contains 7 questions to be completed in 15 minutes.
              </p>

              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Question Types
              </h3>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Arithmetic:</strong> Apply number properties, percentages, ratios, and rates to solve real-world math problems efficiently.
                </li>
                <li>
                  <strong>Algebra:</strong> Analyze and solve equations and inequalities, and translate verbal scenarios into algebraic expressions.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-800 mt-6">
                Timer & Navigation
              </h3>
              <p className="mt-2">
                The timer will start automatically after the countdown. You can
                also click <b>Begin</b> to start immediately.
              </p>
            </div>

            <button
              onClick={startSection}
              className="bg-blue-600 text-white font-semibold text-base py-3 px-6 rounded-md w-full max-w-xs mx-auto block mt-8 hover:bg-blue-800 transition-colors"
            >
              Begin {sectionTitle}{" "}
              <span>
                <FontAwesomeIcon icon={faArrowRight} beatFade />
              </span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <MathJaxContext>
      <div className="bg-gray-100 min-h-screen flex flex-col pb-20">
        <header className="w-full bg-blue-600 text-white p-2 px-7 flex justify-between items-center shadow-md text-center font-semibold text-lg">
          <div>
            <span className="font-semibold">
              {sectionTitle} — Q{questionNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full font-semibold text-blue-800 shadow-inner border border-blue-200">
            <span>⏱</span>
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="w-[90%] mx-auto mt-4">
          <div className="mb-6 text-gray-800 text-base sm:text-lg leading-relaxed flex">
            <span className="mr-2 font-semibold">{questionNumber}.</span>
            <div
              dangerouslySetInnerHTML={{ __html: question?.text || "" }}
              className="flex-1"
            />
          </div>

          {question?.options?.length > 0 && (
            <div className="flex flex-col gap-3">
              {question.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`w-[50%] rounded-lg p-3 cursor-pointer flex items-start transition-all duration-200 ${
                    selected === idx
                      ? "bg-blue-100 border border-blue-500 font-semibold text-blue-800"
                      : "hover:bg-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    checked={selected === idx}
                    onChange={() => handleSelect(idx)}
                    className="accent-blue-600 mt-1 mr-3"
                  />
                  <MathJax inline={false}>{opt}</MathJax>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-center z-[100]">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-8 py-3 rounded-full font-semibold transition-colors ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {submitting ? "Submitting..." : "Next"}
          </button>
        </div>

        {showToast && (
          <div className="fixed bottom-24 right-8 bg-blue-500 text-white p-3 rounded-md shadow-md z-[200]">
            Please select an option before proceeding
          </div>
        )}
      </div>
    </MathJaxContext>
  );
};

export default QuantSection;
