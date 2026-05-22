import React, { useEffect, useState } from "react";

export default function PrivacyPopup() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("privacyAccepted");

    if (saved === "true") {
      setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyAccepted", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 overflow-y-auto max-h-[90vh]">

        <h1 className="text-3xl font-bold mb-4 text-center">
          Privacy Policy & Terms
        </h1>

        <div className="space-y-4 text-sm text-gray-700">

          <p>
            Welcome to Fitness App. By using this app, you agree
            to our Privacy Policy and Terms of Service.
          </p>

          <p>
            We may collect workout activity, meal inputs,
            authentication data, and app usage information
            to improve your fitness experience.
          </p>

          <p>
            This app uses AI-powered diet analysis and fitness
            recommendations through third-party AI services.
          </p>

          <p>
            Some features may require premium subscriptions.
            Subscription payments may be handled through
            third-party payment providers.
          </p>

          <p>
            We use Firebase Authentication, Render, Vercel,
            and OpenRouter AI APIs for app functionality.
          </p>

          <p>
            Your data is handled securely, but no online
            service can guarantee 100% security.
          </p>

          <p>
            By clicking “I Accept”, you consent to our
            privacy policy, data processing, and subscription terms.
          </p>

        </div>

        <button
          onClick={handleAccept}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          I Accept
        </button>

      </div>
    </div>
  );
}