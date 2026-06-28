import Tile from "./Tile";

const BoardGrid = ({
  tiles,
  onTileClick,
  hintTileId,
}) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="p-4 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-white/10 shadow-2xl">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(8, 78px)",
            gridTemplateRows: "repeat(8, 78px)",
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.tile_id}
              style={{
                gridColumn: tile.col + 1,
                gridRow: tile.row + 1,
              }}
            >
              <Tile
                tile={tile}
                onClick={() => onTileClick(tile)}
                isHinted={tile.tile_id === hintTileId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardGrid;