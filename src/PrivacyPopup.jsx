import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from './firebase';

const db = getFirestore();

export default function PrivacyPopup() {
  const [accepted, setAccepted] = useState(true); // 👈 START as true (hidden)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const key = `privacyAccepted_${currentUser.uid}`;
        const saved = localStorage.getItem(key);
        if (saved === "true") {
          setAccepted(true); // already accepted, stay hidden
        } else {
          setAccepted(false); // logged in but not accepted → show popup
        }
      } else {
        // No user logged in → hide popup
        setUser(null);
        setAccepted(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      localStorage.setItem(`privacyAccepted_${uid}`, "true");
    }
    setAccepted(true);

    try {
      if (uid) {
        await setDoc(doc(db, 'users', uid), {
          privacyAccepted: true,
          privacyAcceptedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (err) {
      console.error('Failed to persist privacy acceptance:', err);
    }
  };

  // Hide if accepted OR no user logged in
  if (accepted || !user) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-gray-200 shadow-2xl p-7">
        <h1 className="text-2xl font-semibold text-black mb-4 tracking-tight">
          Privacy Policy
        </h1>

        <div className="space-y-4 text-[14px] leading-6 text-gray-600 max-h-[320px] overflow-y-auto pr-1">
          <p>
            FitCoach AI collects basic account information, workout activity,
            nutrition inputs, and subscription status to improve app features
            and user experience.
          </p>
          <p>
            AI-generated workout and diet recommendations may not always be
            fully accurate and should not replace professional medical or
            fitness advice.
          </p>
          <p>
            Premium subscriptions unlock additional AI features and advanced
            content. Payments are handled securely through third-party payment
            providers.
          </p>
          <p>
            We do not guarantee uninterrupted service availability and users are
            responsible for how they use health and fitness guidance provided by
            the app.
          </p>
          <p>
            By continuing, you agree to our Privacy Policy, Terms of Service,
            and subscription terms.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full mt-6 bg-black text-white py-3 rounded-2xl text-sm font-medium hover:opacity-90 transition-all duration-200"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}