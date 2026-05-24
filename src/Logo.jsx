import React from 'react';

export default function Logo() {
  return (
    <div className="flex justify-center mb-5">
      <img
        src="/Logo192.png"
        alt="FitCoach"
        width={72}
        height={72}
        style={{ borderRadius: '18px' }}
      />
    </div>
  );
}