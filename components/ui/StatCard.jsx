// StatCard component for dashboard statistics

export function StatCard({ title, value, icon, borderColor = '#D4834D', valueColor = '#E84E0F' }) {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
      style={{ backgroundColor: '#2D2620', border: `2px solid ${borderColor}` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#A89F97' }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: valueColor }}>
            {value}
          </p>
        </div>
        <span className="text-5xl">{icon}</span>
      </div>
    </div>
  );
}
