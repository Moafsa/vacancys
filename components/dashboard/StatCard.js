/**
 * StatCard component for displaying statistics in dashboards
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.title - Stat title
 * @param {string|number} props.value - Stat value
 * @param {string} props.subtitle - Optional subtitle
 * @param {string} props.iconColor - Color class for the icon (e.g., 'text-indigo-500')
 * @param {string} props.valueColor - Color class for the value (e.g., 'text-indigo-600')
 */
export default function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  iconColor = 'text-gray-400',
  valueColor = 'text-gray-900'
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconColor}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className={`text-xl font-semibold ${valueColor}`}>{value}</div>
                {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 