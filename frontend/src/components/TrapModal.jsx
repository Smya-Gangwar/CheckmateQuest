import {useEffect, useState,} from "react";

const TrapModal = ({isOpen, onFinish}) => {
  const [timeLeft, setTimeLeft] = useState(15);
  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(15);
    const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-red-700 text-white p-10 rounded-2xl w-full max-w-md text-center border-4 border-red-400 shadow-2xl">
        <h1 className="text-5xl font-black mb-6 animate-pulse">
          TRAP
        </h1>

        <p className="text-xl mb-8">
          You triggered a trap tile.
        </p>

        <div className="text-8xl font-black mb-6">
          {timeLeft}
        </div>

        <p className="text-red-100 text-lg">
          Board access frozen
        </p>
      </div>
    </div>
  );
};

export default TrapModal;