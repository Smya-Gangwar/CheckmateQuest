import { useEffect, useState,} from "react";

const Timer = ({remainingTime,}) => {
  const [timeLeft, setTimeLeft] = useState(remainingTime);

  // Sync with backend updates
  useEffect(() => {setTimeLeft(remainingTime);}, [remainingTime]);

  // Local countdown
  useEffect(() => {const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-red-600 px-6 py-3 rounded-xl text-xl font-bold">
      {minutes}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;