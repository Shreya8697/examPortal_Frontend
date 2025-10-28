import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/user/Profile";
import Activity from "./pages/user/Activity";

// Courses
import BBABMS from "./pages/user/courses/BBABMS";
import SAT from "./pages/user/courses/SAT";
import LNAT from "./pages/user/courses/LNAT";
import LSAT from "./pages/user/courses/LSAT";
import GMAT from "./pages/user/courses/GMAT";
import GRE from "./pages/user/courses/GRE";

// Mock Tests
import NPAT from "./pages/user/mock/NPAT";
import AAT from "./pages/user/mock/AAT";
import FEAT from "./pages/user/mock/FEAT";
import MockLSAT from "./pages/user/mock/MockLSAT";
import MockGMAT from "./pages/user/mock/MockGMAT";
import MockGRE from "./pages/user/mock/MockGRE";

// Exam & Instructions
import Instructions from "./pages/Instructions";
import AdaptiveExamPage from "./pages/EXAM Common/Pages/ExamSectionPage";


// Components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/login";
import ResultPage from "./pages/user/ResultPage";
import ReviewPage from "./pages/user/ReviewPage";

function AppWrapper() {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ------------------- ROUTES WHERE HEADER SHOULD NOT BE SHOWN -------------------
  const routesWithoutHeader = [
    "/mock/gmat/instructions",
    "/mock/gmat/test",
    // Add more routes here in future
  ];

  const hideHeader = routesWithoutHeader.includes(location.pathname);

  return (
    <>
      {/* Header / Navbar */}
      {!hideHeader && (
        <>
          {!user ? (
            <Header onLogin={() => setShowLogin(true)} onSignup={() => setShowSignup(true)} />
          ) : (
            <Navbar loggedInUser={user} onLogout={handleLogout} />
          )}
        </>
      )}

      {/* Routes */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home onLogin={() => setShowLogin(true)} />} />

        {/* Courses */}
        <Route path="/mock/bba&bms" element={<ProtectedRoute><BBABMS /></ProtectedRoute>} />
        <Route path="/mock/sat" element={<ProtectedRoute><SAT /></ProtectedRoute>} />
        <Route path="/mock/lnat" element={<ProtectedRoute><LNAT /></ProtectedRoute>} />
        <Route path="/mock/lsat" element={<ProtectedRoute><LSAT /></ProtectedRoute>} />
        <Route path="/mock/gmat" element={<ProtectedRoute><GMAT /></ProtectedRoute>} />
        <Route path="/mock/gre" element={<ProtectedRoute><GRE /></ProtectedRoute>} />

        {/* Mock Tests */}
        <Route path="/courses/npat" element={<ProtectedRoute><NPAT /></ProtectedRoute>} />
        <Route path="/courses/aat" element={<ProtectedRoute><AAT /></ProtectedRoute>} />
        <Route path="/courses/feat" element={<ProtectedRoute><FEAT /></ProtectedRoute>} />
        <Route path="/courses/lsat" element={<ProtectedRoute><MockLSAT /></ProtectedRoute>} />
        <Route path="/courses/gmat" element={<ProtectedRoute><MockGMAT /></ProtectedRoute>} />
        <Route path="/courses/gre" element={<ProtectedRoute><MockGRE /></ProtectedRoute>} />

        {/* Instructions & Exam */}
        <Route path="/mock/gmat/instructions" element={<ProtectedRoute><Instructions /></ProtectedRoute>} />
        <Route
          path="/mock/gmat/test"
          element={
            <ProtectedRoute>
              <AdaptiveExamPage
                sectionName="Quantitative"
                sectionNo={1}
                totalSections={3}
                duration={15 * 60} // 15 minutes
                examType="gmat"
                testName="test1"
              />
            </ProtectedRoute>
          }
        />

        {/* ✅ New Results Page */}
        {/* ✅ Dynamic route for result details */}

{/* ✅ New Results Page */}
<Route
  path="/results/:examType/:testName/:attempt"
  element={<ProtectedRoute><ResultPage /></ProtectedRoute>}
/>

{/* ✅ New Review Page */}
<Route
  path="/review/:examType/:testName/:attempt/:sectionName"
  element={<ProtectedRoute><ReviewPage /></ProtectedRoute>}
/>

        {/* User Pages */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<h1 className="text-center mt-20">404 - Page Not Found</h1>} />
      </Routes>

      {/* Auth Modals */}
      {!user && showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(userData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setShowLogin(false);
          }}
          onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
          onSwitchToForgotPassword={() => { setShowLogin(false); setShowForgotPassword(true); }}
        />
      )}

      {!user && showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSignupSuccess={(userData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setShowSignup(false);
          }}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
        />
      )}

      {!user && showForgotPassword && (
        <ForgotPassword
          onClose={() => setShowForgotPassword(false)}
          onSwitchToLogin={() => { setShowForgotPassword(false); setShowLogin(true); }}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
