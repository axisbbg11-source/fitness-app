import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <div className="max-w-2xl mx-auto px-5 py-10">
        
        <button onClick={() => navigate(-1)} className="text-sky-400 text-sm mb-6 flex items-center gap-1 hover:underline">
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: May 2026</p>

        <div className="space-y-8 text-gray-300 text-sm leading-7">

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">1. Introduction</h2>
            <p>Welcome to FitCoach ("we", "our", or "us"). We are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our application at <a href="https://www.fitcoach.biz" className="text-sky-400">www.fitcoach.biz</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Google account information (name, email, profile photo) when you sign in</li>
              <li>Workout activity (exercises performed, rep counts, calories burned)</li>
              <li>Nutrition inputs (meals entered for diet analysis)</li>
              <li>Daily progress and streak data</li>
              <li>Subscription and payment status</li>
              <li>Device information and browser type</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">3. Camera Usage</h2>
            <p>FitCoach uses your device camera solely for real-time pose detection and rep counting. We do <strong className="text-white">not</strong> record, store, or transmit any video or images from your camera. All pose detection is processed locally on your device using MediaPipe technology and no camera data ever leaves your device.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>To provide and improve our fitness tracking features</li>
              <li>To generate personalized AI workout and diet recommendations</li>
              <li>To track your daily progress, streaks and workout history</li>
              <li>To manage your account and subscription</li>
              <li>To send important account notifications via email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">5. Data Storage</h2>
            <p>Your data is stored securely using Google Firebase. Workout progress and preferences are also stored locally on your device using localStorage. We use industry-standard security measures to protect your information.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">6. Third-Party Services</h2>
            <p className="mb-2">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Google Firebase — authentication and data storage</li>
              <li>MediaPipe — on-device pose detection (no data sent to servers)</li>
              <li>OpenRouter AI — diet analysis and recommendations</li>
              <li>Vercel — app hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">7. AI Disclaimer</h2>
            <p>AI-generated workout and diet recommendations are for general informational purposes only and may not always be fully accurate. They should not replace professional medical, fitness, or nutritional advice. Always consult a qualified professional before making significant changes to your exercise or diet routine.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">8. Payments</h2>
            <p>Premium subscriptions unlock additional AI features. Payments are handled securely through third-party payment providers. We do not store your payment card details.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">9. Your Rights</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Access the personal data we hold about you</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of non-essential communications</li>
              <li>Export your workout data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">10. Children's Privacy</h2>
            <p>FitCoach is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or your data, contact us at:</p>
            <p className="text-sky-400 mt-1">borgohainbibek22@gmail.com</p>
            <p className="text-gray-400">www.fitcoach.biz</p>
          </section>

        </div>
      </div>
    </div>
  );
}