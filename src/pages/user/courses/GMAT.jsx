import { useNavigate } from "react-router-dom";
import { useState } from "react";

function GMAT() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartTest = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/mock/gmat/instructions");
    }, 3000); // 3 seconds delay
  };

  return (
    <>
      {/* Fullscreen Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
          {/* Simple Spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800">
            You are being redirected...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we prepare your secure exam portal
          </p>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-6">GMAT Diagnostic Test</h1>

        {/* Subtitle */}
        <p className="text-lg font-medium mb-10">
          Start your complete mock test journey
        </p>

        {/* Test Cards */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Mock Test 1 */}
          <div className="bg-white border rounded-lg shadow p-8 text-center w-64">
            <h2 className="text-xl font-semibold mb-6">Mock Test 1</h2>
            <button
              className="bg-white text-black px-6 py-2 rounded-full shadow hover:shadow-md"
              onClick={handleStartTest}
              disabled={loading}
            >
              Access Your Test Now
            </button>
          </div>

          {/* Mock Test 2 */}
          <div className="bg-gray-400 border rounded-lg shadow p-8 text-center w-64">
            <h2 className="text-xl font-semibold mb-6">Mock Test 2</h2>
            <button className="bg-white text-black px-6 py-2 rounded-full shadow hover:shadow-md">
              Unlock Now
            </button>
          </div>

          {/* Mock Test 3 */}
          <div className="bg-gray-400 border rounded-lg shadow p-8 text-center w-64">
            <h2 className="text-xl font-semibold mb-6">Mock Test 3</h2>
            <button className="bg-white text-black px-6 py-2 rounded-full shadow hover:shadow-md">
              Unlock Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GMAT;
