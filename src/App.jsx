import { useEffect, useRef } from "react";

export default function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>AI Fitness Coach - Camera Test</h1>

      <video
      
  ref={videoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "400px",
    height: "300px",
    border: "2px solid black",
    background: "black"
  }}
/>
      
    </div>
  );
}