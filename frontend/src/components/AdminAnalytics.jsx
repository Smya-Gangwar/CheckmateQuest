const AdminAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  const cards = [
    ["Teams", analytics.total_teams],
    ["Active", analytics.active_sessions],
    ["Highest", analytics.highest_score],
    ["Average", analytics.average_score],
    ["Status", analytics.room_status],
    ["Time Left", analytics.remaining_time],
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      {cards.map(([label, value]) => (
        <div
          key={label}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <p className="text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
      ))}
    </div>
  );
};

export default AdminAnalytics;