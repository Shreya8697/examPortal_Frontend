// import { MathJaxContext, MathJax } from 'better-react-mathjax';
// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// import StartTimer from './Starttimer';

// const QuantPage = ({ onComplete }) => {
// //   const { setQuantresult } = useContext(Result);
//   const [current, setCurrent] = useState(0);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(15 * 60);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [testStarted, setTestStarted] = useState(false);
//   const [showDisabledMessage, setShowDisabledMessage] = useState(false);
//   const isCurrentAnswered = userAnswers[current] !== undefined && userAnswers[current] !== null;

//   const [quantques, setQuantques] = useState([]);
//   const Myapi = import.meta.env.VITE_BASE_URL;

//   useEffect(() => {
//     axios.get(Myapi + '/website/questions/quant')
//       .then(res => res.data)
//       .then(finalres => setQuantques(finalres.data));
//   }, []);

//   const question = quantques[current];

//   useEffect(() => {
//     if (testStarted) {
//       localStorage.setItem('quantAnswers', JSON.stringify(userAnswers));
//     }
//   }, [userAnswers, testStarted]);

//   // Timer logic
//   useEffect(() => {
//     if (!testStarted) return;
//     let timer;
//     if (!localStorage.getItem("examStartTime")) {
//       localStorage.setItem("examStartTime", Date.now());
//     }
//     const startTime = parseInt(localStorage.getItem("examStartTime"), 10);
//     const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
//     let remaining = 15 * 60 - elapsedSeconds;
//     setTimeLeft(Math.max(remaining, 0));
//     if (remaining <= 0 && !isSubmitting) handleSectionComplete();

//     timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           if (!isSubmitting) handleSectionComplete();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [testStarted, isSubmitting]);

//   const formatTime = () => {
//     const min = Math.floor(timeLeft / 60);
//     const sec = timeLeft % 60;
//     return `${min}:${sec < 10 ? '0' + sec : sec}`;
//   };

//   const handleOptionSelect = (idx) => {
//     const updated = [...userAnswers];
//     updated[current] = idx;
//     setUserAnswers(updated);
//   };

//   const handleNext = () => {
//     if (current < quantques.length - 1) setCurrent(prev => prev + 1);
//   };

//   const handleSectionComplete = () => {
//     setIsSubmitting(true);
//     onComplete();
//   };

//   const handleFinalSubmit = async () => {
//     const lastIndex = quantques.length - 1;
//     if (userAnswers[lastIndex] === undefined || userAnswers[lastIndex] === null) {
//       setShowDisabledMessage(true);
//       setTimeout(() => setShowDisabledMessage(false), 2000);
//       return;
//     }

//     setIsSubmitting(true);
//     const gUser = JSON.parse(localStorage.getItem("gUser"));
//     const email = gUser?.email;
//     if (!email) return setIsSubmitting(false);

//     const formattedResponses = quantques.map((q, index) => ({
//       id: q.id,
//       selected: userAnswers[index] ?? null,
//       correct: q.correct,
//     }));

//     try {
//       const res = await axios.post(`${Myapi}/website/answers/quant`, {
//         email,
//         responses: formattedResponses,
//       });
//       setQuantresult(res.data.data);
//       localStorage.setItem("quantFinalAnswers", JSON.stringify(formattedResponses));
//       onComplete();
//     } catch (err) {
//       console.error(err);
//       alert("You already attempted this exam.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const startTest = () => {
//     setShowInstructions(false);
//     setTestStarted(true);
//   };

//   // ===== Tailwind JSX =====
//   if (showInstructions) {
//     return (
//       <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
//         <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8">
//           <h2 className="text-2xl font-bold flex justify-between items-center">
//             Quantitative Section Instructions
//             {showInstructions && (
//   <StartTimer 
//     onTimeUp={startTest} 
//     duration={60} // optional, default 60s
//   />
// )}

//           </h2>

//           <div className="mt-6 space-y-4 text-gray-700">
//             <h3 className="text-xl font-semibold text-blue-800">Section Overview</h3>
//             <p>This section contains {quantques.length} questions to be completed in 15 minutes.</p>

//             <h3 className="text-xl font-semibold text-blue-800">Question Types</h3>
//             <ul className="list-disc list-inside">
//               <li><strong>Arithmetic:</strong> Apply number properties, percentages, ratios, and rates.</li>
//               <li><strong>Algebra:</strong> Solve equations, inequalities, and translate verbal scenarios.</li>
//             </ul>

//             <h3 className="text-xl font-semibold text-blue-800">Navigation</h3>
//             <p>Use the Next button to move to the next question.</p>

//             <h3 className="text-xl font-semibold text-blue-800">Timer</h3>
//             <p>The 15-minute timer will start when you begin the test.</p>
//           </div>

//           <button
//             className="mt-6 w-full max-w-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition"
//             onClick={startTest}
//           >
//             Begin Quantitative Section
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <MathJaxContext
//       config={{
//         loader: { load: ["[tex]/ams"] },
//         tex: {
//           inlineMath: [["$", "$"], ["\\(", "\\)"]],
//           displayMath: [["$$", "$$"], ["\\[", "\\]"]],
//           packages: { "[+]": ["ams"] },
//         },
//       }}
//     >
//       <div className="min-h-screen bg-gray-100 flex flex-col p-4">
//         {/* Timer */}
//         <div className="flex justify-between items-center bg-blue-100 text-blue-900 font-semibold px-6 py-2 rounded-full mb-4 shadow-inner">
//           <h3>Question {current + 1} of {quantques.length}</h3>
//           <span>Time Left: {formatTime()}</span>
//         </div>

//         {/* Question */}
//         <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col">
//           <div className="question-text mb-6 text-gray-800 text-base">
//             {question.text.split("<br/>").map((line, i) => (
//               <div key={i}>
//                 <MathJax inline={false} dynamic={true}>{line}</MathJax>
//               </div>
//             ))}
//           </div>

//           {question.image && (
//             <img src={question.image} alt="question" className="max-w-full mb-4 rounded" />
//           )}

//           {/* Options */}
//           <div className="flex flex-col gap-2">
//             {question.options.map((opt, idx) => (
//               <label
//                 key={idx}
//                 className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition 
//                   ${userAnswers[current] === idx ? 'bg-blue-100 font-semibold text-blue-800' : 'hover:bg-gray-100'}`}
//               >
//                 <input
//                   type="radio"
//                   name={`q-${current}`}
//                   checked={userAnswers[current] === idx}
//                   onChange={() => handleOptionSelect(idx)}
//                   disabled={isSubmitting}
//                   className="accent-blue-600"
//                 />
//                 <MathJax inline={false} dynamic={true}>{opt}</MathJax>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center gap-4 shadow">
//           {current < quantques.length - 1 ? (
//             <button
//               onClick={handleNext}
//               disabled={!isCurrentAnswered || isSubmitting}
//               className={`px-6 py-2 rounded-full font-semibold transition 
//                 ${!isCurrentAnswered ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleFinalSubmit}
//               disabled={userAnswers[current] === null || isSubmitting}
//               className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit All'}
//             </button>
//           )}
//         </div>

//         {/* Toast */}
//         {showDisabledMessage && (
//           <div className="fixed bottom-20 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-slide-in-fade-out">
//             Please select an option before proceeding.
//           </div>
//         )}
//       </div>
//     </MathJaxContext>
//   );
// };

// export default QuantPage;
