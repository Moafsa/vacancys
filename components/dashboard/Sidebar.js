import { useState } from 'react';
import Link from 'next/link';

/**
 * Sidebar component for dashboard navigation
 * 
 * @param {Object} props
 * @param {Array} props.navItems - Navigation items with name, icon, section, and optional badge
 * @param {string} props.activeSection - Current active section
 * @param {Function} props.setActiveSection - Function to update the active section
 * @param {string} props.bgColor - Background color class (e.g., 'bg-indigo-700')
 * @param {string} props.bgColorDarker - Darker background color class (e.g., 'bg-indigo-800')
 * @param {string} props.title - Sidebar title
 */
export default function Sidebar({ 
  navItems, 
  activeSection, 
  setActiveSection, 
  bgColor = 'bg-indigo-700', 
  bgColorDarker = 'bg-indigo-800',
  bgColorHover = 'bg-indigo-600',
  title = 'Vacancy'
}) {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className={`flex flex-col h-0 flex-1 ${bgColor}`}>
          <div className={`flex items-center h-16 flex-shrink-0 px-4 ${bgColorDarker}`}>
            <span className="text-white text-lg font-semibold">{title}</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    setActiveSection(item.section);
                    if (item.action) {
                      item.action();
                    }
                  }}
                  className={`${
                    activeSection === item.section
                      ? `${bgColorDarker} text-white`
                      : `text-white text-opacity-80 hover:${bgColorHover} hover:text-white`
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <div className="mr-3 h-5 w-5">{item.icon}</div>
                  {item.name}
                  {item.badge && (
                    <span className={`inline-flex items-center justify-center ml-auto w-5 h-5 text-xs font-semibold rounded-full ${bgColorDarker} text-white`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 