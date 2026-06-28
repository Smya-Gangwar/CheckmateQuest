import {
  Trophy,
  Coins,
  Lightbulb,
} from "lucide-react";

const ScoreBar = ({
  score,
  coins,
  onHint,
}) => {
  const boxClass =
    "h-14 min-w-[110px] bg-white/5 border border-white/10 px-5 rounded-2xl flex items-center justify-center gap-3 backdrop-blur-md";

  return (
    <div className="flex gap-4 flex-wrap items-center">
      {/* Score */}
      <div className={`${boxClass} relative group`}>
        <Trophy size={18} />
        <span className="font-semibold">
          {score}
        </span>

        {/* Tooltip */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Current Score
        </div>
      </div>

      {/* Coins */}
      <div className={`${boxClass} relative group`} >
        <Coins size={18} />
        <span className="font-semibold">
          {coins}
        </span>

        {/* Tooltip */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Available Coins
        </div>
      </div>

      {/* Hint */}
      <div className="relative group">
        <button
          onClick={onHint}
          className="h-14 w-14 bg-yellow-400 text-black rounded-2xl flex items-center justify-center font-bold hover:scale-105 transition"
        >
          <Lightbulb size={18} />
        </button>

        {/* Tooltip */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Hint
        </div>
      </div>
    </div>
  );
};

export default ScoreBar;