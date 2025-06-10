/**
 * ActionCard component for dashboard quick actions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.title - Action title
 * @param {string} props.description - Action description
 * @param {Function} props.action - Action handler function
 * @param {string} props.iconColor - Color class for the icon
 */
export default function ActionCard({
  icon,
  title,
  description,
  action,
  iconColor = 'text-indigo-600'
}) {
  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all cursor-pointer" 
      onClick={action}
    >
      <div className="p-5">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconColor}`}>
            {icon}
          </div>
          <div className="ml-4 w-0 flex-1">
            <dt className="text-base font-medium text-gray-900">{title}</dt>
            <dd className="mt-1 text-sm text-gray-500">{description}</dd>
          </div>
        </div>
      </div>
    </div>
  );
} 