import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// StatCard component for dashboard statistics
export function StatCard({ title, value, icon, borderColor = '#D4834D', valueColor = '#E84E0F', bgColor = '#FEF0EB' }) {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      style={{ backgroundColor: '#2D2620', border: `2px solid ${borderColor}` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#A89F97' }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: valueColor }}>
            {value}
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: bgColor }}>
          <FontAwesomeIcon icon={icon} className="text-2xl" style={{ color: valueColor }} />
        </div>
      </div>
    </div>
  );
}
