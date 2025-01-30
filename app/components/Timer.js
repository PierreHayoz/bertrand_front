import { useState, useEffect } from "react";

const Timer = ({
  duration
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 50; // Intervalle de mise à jour (50 ms)

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const percentage = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(percentage);

      if (percentage >= 100) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div >
          {Math.round(progress)}%
      </div>
  );
};

export default Timer;
