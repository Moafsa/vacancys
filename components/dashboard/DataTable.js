/**
 * DataTable component for displaying tabular data in dashboards
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions with {key, label, render}
 * @param {Array} props.data - Array of data objects
 * @param {string} props.title - Optional table title
 * @param {string} props.viewAllLink - Optional link to view all data
 * @param {Function} props.onRowClick - Optional function to handle row clicks
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Array} props.rowActions - Optional array of action objects with {label, icon, handler}
 */
export default function DataTable({
  columns,
  data,
  title,
  viewAllLink,
  onRowClick,
  isLoading = false,
  rowActions = []
}) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {title && (
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          {viewAllLink && (
            <a href={viewAllLink} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </a>
          )}
        </div>
      )}
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {rowActions.length > 0 && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} className="px-6 py-4 text-center">
                    <div className="animate-pulse flex justify-center">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr 
                    key={item.id || rowIndex} 
                    className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((column) => (
                      <td key={`${item.id || rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                        {column.render ? column.render(item) : item[column.key]}
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          {rowActions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.handler(item);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {action.icon ? (
                                <span className="flex items-center">
                                  {action.icon}
                                  {action.label && <span className="ml-1">{action.label}</span>}
                                </span>
                              ) : (
                                action.label
                              )}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 