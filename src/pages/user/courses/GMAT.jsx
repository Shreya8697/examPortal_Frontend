import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Lock } from "lucide-react";

function GMAT() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartTest = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/mock/gmat/instructions");
    }, 3000); // 3 seconds delay
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
      {/* Fullscreen Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800">
            You are being redirected...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we prepare your exam portal
          </p>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          GMAT Diagnostic Test
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Start your complete mock test journey
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          {testCard("Mock Test 1", true)}
          {testCard("Mock Test 2", false)}
          {testCard("Mock Test 3", false)}
        </div>
      </div>
    </>
  );
}

export default GMAT;
