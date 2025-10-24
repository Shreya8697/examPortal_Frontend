import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Lock, Shield } from "lucide-react";

function GMAT() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartTest = () => {
    setLoading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigate("/mock/gmat/instructions");
        }, 500); // Small delay after progress completes
      }
    }, 300); // Update progress every 300ms for 3 seconds total
  };

  const handlePurchase = (title) => {
    alert(`Purchase flow for ${title} (₹999)`);
    // You can integrate Razorpay / Stripe / custom purchase logic here.
  };

  const testCard = (title, available = true) => (
    <div
      className={`relative rounded-xl shadow-lg p-8 text-center w-64 transition-transform transform hover:scale-105 ${
        available ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {/* Lock Icon - Top Right */}
      {!available && (
        <div className="absolute top-3 right-3 bg-gray-300 p-2 rounded-full">
          <Lock className="h-5 w-5 text-gray-700" />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-sm mb-6">
        Allowed Attempts: <b>{available ? "2" : "2"}</b>
      </p>

      {available ? (
        <button
          className="w-full px-6 py-2 rounded-full font-medium bg-white text-blue-700 hover:bg-gray-100 transition-colors duration-200"
          onClick={handleStartTest}
          disabled={loading}
        >
          Access Test
        </button>
      ) : (
        <button
          className="w-full px-6 py-2 rounded-full font-medium bg-cyan-300 text-white hover:bg-yellow-600 transition-colors duration-200"
          onClick={() => handlePurchase(title)}
        >
          Purchase ₹
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Fullscreen Secure Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
            {/* Secure Icon */}
            <Shield className="h-16 w-16 text-blue-600 mb-6 animate-pulse" />
            
            {/* Spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-6"></div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Securing Your Session
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Please wait while we prepare your secure exam environment. Your data is protected.
            </p>
            <p className="text-sm text-gray-500">{progress}% Complete</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12 px-4">
        {/* Header with Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GMAT Diagnostic Test
          </h1>
          <p className="text-lg text-gray-600">
            Embark on your complete mock test journey with confidence
          </p>
        </div>

        {/* Test Cards */}
        <div className="flex flex-col sm:flex-row gap-6">
          {testCard("Mock Test 1", true)}
          {testCard("Mock Test 2", false)}
          {testCard("Mock Test 3", false)}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Secure and trusted by thousands of test-takers worldwide.</p>
        </div>
      </div>
    </>
  );
}

export default GMAT;
