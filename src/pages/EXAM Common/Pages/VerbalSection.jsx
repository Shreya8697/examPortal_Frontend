  import React, { useState, useEffect, useRef } from "react";
  import { MathJaxContext, MathJax } from "better-react-mathjax";
  import axios from "axios";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

  const VerbalSection = ({
    sessionId,
    setSessionId,
    testName,
    sectionKey,
    sectionTitle = "Verbal",
    timeForSection = 15 * 60,
    onSectionComplete,
    currentSectionIdx,
    totalSections
  }) => {
    const [question, setQuestion] = useState(null);
    const [selected, setSelected] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [showInstruction, setShowInstruction] = useState(true);
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeForSection);
    const [preTimer, setPreTimer] = useState(60);
    const [showToast, setShowToast] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [sessionIdState, setSessionIdState] = useState(sessionId || null);
    const [timeUp, setTimeUp] = useState(false);
  
    const preTimerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
      setSessionIdState(sessionId || null);
    }, [sessionId]);

    const formatTime = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // ✅ Start Section
    const startSection = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.email) throw new Error("User not logged in");

        const payload = { email: user.email, examType: "gmat", testName, section: sectionKey };
        if (sessionIdState) payload.resumeSessionId = sessionIdState;

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/start`, payload);
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
            passage: q.passage || null
          });
        }

        setShowInstruction(false);
        setStarted(true);
        setSelected(null);
        setQuestionNumber(1);
        setTimeLeft(timeForSection);
        setTimeUp(false);
      } catch (err) {
        console.error(err);
        alert("Error starting verbal section: " + (err.response?.data?.message || err.message));
      }
    };

    // ⏳ Pre-start countdown
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
    
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "You are not allowed to refresh this page before starting the exam!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Prevent back navigation
    window.history.pushState(null, null, window.location.href); // push a dummy state
    const handlePopState = () => {
      // Re-push the state to prevent going back
      window.history.pushState(null, null, window.location.href);
      alert("You are not allowed to go back during the exam!");
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);


    // ⏱ Section Timer
    useEffect(() => {
      if (!started) return;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimeUp(true);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }, [started]);

    // ✅ Auto Submit on time end
    const handleAutoSubmit = async () => {
      try {
        if (submitting) return;
        setSubmitting(true);
        await axios.post(`${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/finish`, {
          sessionId: sessionIdState,
          section: sectionKey,
          autoSubmit: true
        });
        setStarted(false);
        onSectionComplete?.();
      } catch (err) {
        console.error("Auto submit error:", err);
      } finally {
        setSubmitting(false);
      }
    };

    // ✅ Handle Option Select
    const handleSelect = (idx) => setSelected(idx);

    // ✅ Manual Submit
    const handleSubmit = async () => {
      if (selected === null) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }

      setSubmitting(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/submit`, {
          sessionId: sessionIdState,
          section: sectionKey,
          questionId: question.id,
          selected,
        });

        if (res.data.finished || !res.data.nextQuestion) {
          await axios.post(`${import.meta.env.VITE_BASE_URL}/website/exam/adaptive/finish`, {
            sessionId: sessionIdState,
            section: sectionKey,
            autoSubmit: false,
          });
          clearInterval(timerRef.current);
          setStarted(false);
          onSectionComplete?.();
          return;
        }

        const nq = res.data.nextQuestion || {};
        setQuestion({
          id: nq.id ?? null,
          text: nq.text ?? "",
          options: Array.isArray(nq.options) ? nq.options : [],
          type: nq.type ?? "single",
          passage: nq.passage || null
        });
        setSelected(null);
        setQuestionNumber(prev => prev + 1);
      } catch (err) {
        console.error(err);
        alert("Error submitting answer: " + (err.response?.data?.message || err.message));
      } finally {
        setSubmitting(false);
      }
    };

    // 📝 Instruction Screen
    if (showInstruction) {
      return (
        <>
          <div className="w-full bg-blue-600 text-white py-3 px-6 shadow-md text-center font-semibold text-lg">
            Section {currentSectionIdx + 1} of {totalSections} — {sectionTitle}
          </div>
          <div className="min-h-screen flex flex-col font-sans bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto my-8">
              <h2 className="text-2xl font-semibold text-slate-800">{sectionTitle} Section Instructions</h2>
              <div className="text-red-600 font-semibold text-lg mt-2">
                Time to begin: {preTimer} sec
              </div>
              <div className="my-6 leading-relaxed text-slate-700">
                <h3 className="text-xl font-semibold text-blue-800 mt-6">Section Overview</h3>
                <p className="mt-2">This section contains verbal reasoning questions.</p>
                <h3 className="text-xl font-semibold text-blue-800 mt-6">Question Types</h3>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Critical Reasoning</li>
                  <li>Reading Comprehension</li>
                  <li>Sentence Correction</li>
                </ul>
                <h3 className="text-xl font-semibold text-blue-800 mt-6">Timer & Navigation</h3>
                <p className="mt-2">
                  The timer will start automatically after the countdown. Click <b>Begin</b> to start immediately.
                </p>
              </div>
              <button
                onClick={startSection}
                className="bg-blue-600 text-white font-semibold text-base py-3 px-6 rounded-md w-full max-w-xs mx-auto block mt-8 hover:bg-blue-800 transition-colors"
              >
                Begin {sectionTitle} <span><FontAwesomeIcon icon={faArrowRight} beatFade /></span>
              </button>
            </div>
          </div>
        </>
      );
    }

    // 🧠 Question Screen
    return (
      <MathJaxContext>
        <div className="bg-gray-100 min-h-screen mb-6 flex flex-col pb-20">
          {/* Header */}
          <header className="w-full bg-blue-600 text-white p-2 px-7 flex justify-between items-center shadow-md text-center font-semibold text-lg">
            <div>
              <span>{sectionTitle} — Q{questionNumber}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full font-semibold text-blue-800 shadow-inner border border-blue-200">
              <span>⏱</span>
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </header>

          {/* Passage + Question */}
          <div className="w-full mt-0 flex flex-col md:flex-row gap-6 p-3">

            {/* Left: Passage */}
           {question?.passage && (
  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-5 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 rounded-t-xl" />
    
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-800 text-lg tracking-wide">Passage</h3>
      <span className="text-sm text-gray-500 italic">Read Carefully</span>
    </div>

    <div className="overflow-auto max-h-[400px] pr-2 passage-scroll">
      <div
        className="text-gray-800 text-justify leading-relaxed text-[15px] whitespace-pre-wrap font-serif first-line:pl-4"
        dangerouslySetInnerHTML={{ __html: question.passage }}
      />
    </div>
  </div>
)}


            {/* Right: Question + Options */}
            <div className="flex-1">
              <div className="mb-6 text-gray-800 text-base sm:text-lg leading-relaxed flex">
                <span className="mr-2 font-semibold">{questionNumber}.</span>
                <div dangerouslySetInnerHTML={{ __html: question?.text || "" }} className="flex-1" />
              </div>

              {question?.options?.length > 0 && (
                <div className="flex flex-col gap-2">
                  {question.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`w-full md:w-[80%] rounded-lg p-2 cursor-pointer flex items-start transition-all duration-200 ${
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
          </div>

          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-center z-[100]">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitting ? "Submitting..." : "Next"}
            </button>
          </div>

          {/* Toasts */}
          {showToast && (
            <div className="fixed bottom-24 right-8 bg-blue-600 text-white px-4 py-2 rounded shadow-lg">
              Please select an option before proceeding
            </div>
          )}
          {timeUp && (
            <div className="fixed bottom-20 right-8 bg-orange-600 text-white px-4 py-2 rounded shadow-lg">
              ⏰ Time's up! Auto-submitting...
            </div>
          )}
        </div>
      </MathJaxContext>
    );
  };

  export default VerbalSection;
