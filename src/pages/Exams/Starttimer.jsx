import React, { useState, useEffect } from "react";

const StartTimer = ({ onTimeUp, duration = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const expireTime = Date.now() + duration * 1000; // duration in seconds
    const interval = setInterval(() => {
      const diff = Math.floor((expireTime - Date.now()) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        onTimeUp(); // automatically triggers next action
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, duration]);

  return (
    <div style={{ color: "#d4290f", fontWeight: "600" }}>
      Time to begin: {timeLeft} sec
    </div>
  );
};

export default StartTimer;
