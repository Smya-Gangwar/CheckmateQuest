const AdminLeaderboard = ({ leaderboard }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-5">Leaderboard</h2>

      <div className="space-y-4">
        {leaderboard.map((team) => (
          <div
            key={team.session_id}
            className="flex justify-between bg-white/5 p-4 rounded-xl"
          >
            <div>
              #{team.rank} {team.team_name}
            </div>
            <div className="font-bold">{team.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLeaderboard;