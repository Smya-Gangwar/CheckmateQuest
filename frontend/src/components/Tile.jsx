import {
  Crown,
  Shield,
  Castle,
  Gem,
  HelpCircle,
} from "lucide-react";

const Tile = ({ tile, onClick, isHinted }) => {
  const getTileStyle = () => {
    if (tile.state === "LOCKED") {
      return "bg-zinc-900 border-zinc-700";
    }

    if (tile.state === "SOLVED") {
      return "bg-emerald-500/20 border-emerald-400";
    }

    switch (tile.visible_type) {
      case "PAWN":
        return "bg-cyan-500/20 border-cyan-400";

      case "KNIGHT":
        return "bg-violet-500/20 border-violet-400";

      case "ROOK":
        return "bg-rose-500/20 border-rose-400";

      case "TREASURE":
        return "bg-amber-400/20 border-amber-300";

      case "TRAP":
        return "bg-cyan-500/20 border-cyan-400";

      default:
        return "bg-zinc-800 border-zinc-700";
    }
  };

  const renderIcon = () => {
    if (tile.state === "LOCKED") {
      return <HelpCircle size={24} />;
    }

    switch (tile.visible_type) {
      case "PAWN":
        return <Shield size={24} />;

      case "KNIGHT":
        return <Crown size={24} />;

      case "ROOK":
        return <Castle size={24} />;

      case "TREASURE":
        return <Gem size={24} />;

      case "TRAP":
        return <Shield size={24} />;

      default:
        return null;
    }
  };

  return (
    <div
      onClick={
        tile.state === "UNLOCKED"
          ? onClick
          : undefined
      }
      className={`
        w-full h-full rounded-2xl
        border backdrop-blur-md
        flex items-center justify-center
        transition-all duration-300
        shadow-lg
        ${
          tile.state === "UNLOCKED"
            ? "cursor-pointer hover:scale-105 hover:shadow-2xl"
            : "cursor-not-allowed"
        }
        ${getTileStyle()}
        ${
          isHinted
            ? "ring-4 ring-yellow-300 animate-pulse"
            : ""
        }
      `}
    >
      <div className="text-white">
        {renderIcon()}
      </div>
    </div>
  );
};

export default Tile;