import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  BriefcaseIcon,
  CashIcon,
  ChartBarIcon,
  ChatIcon,
  ClockIcon,
  StarIcon,
  LightningBoltIcon,
  SearchIcon,
  BookmarkIcon,
  DocumentTextIcon,
  UserIcon,
  CreditCardIcon,
  MailIcon,
  BellIcon,
  CogIcon,
  ViewGridIcon,
  FolderIcon,
  AcademicCapIcon,
  ClipboardListIcon,
  EmojiHappyIcon,
  HeartIcon,
} from '@heroicons/react/outline';
import { StatCard, DataTable } from '../../components/dashboard';
import FreelancerLayout from '../../components/dashboard/FreelancerLayout';

export default function FreelancerDashboard() {
  const { t } = useTranslation('common');
  const [stats] = useState({
    activeProjects: 3,
    completedProjects: 12,
    earnings: 2500,
    rating: 4.8,
    hoursWorked: 156,
    unreadMessages: 5,
    availableCredits: 10,
    profileCompleteness: 85,
    profileViews: 47,
  });

  const [recentProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Website Development',
      client: 'Tech Solutions Inc.',
      status: 'In Progress',
      dueDate: '2024-04-15',
      budget: 3000,
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      client: 'Creative Apps LLC',
      status: 'In Progress',
      dueDate: '2024-04-20',
      budget: 2500,
    },
    {
      id: 3,
      title: 'WordPress Blog Customization',
      client: 'Blog Masters',
      status: 'In Progress',
      dueDate: '2024-04-25',
      budget: 1500,
    },
  ]);
  
  const [recommendedJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      description: 'Looking for a senior developer with 3+ years of React experience',
      budget: '3000-5000',
      postedDate: '2 hours ago',
      skillMatch: '95%',
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      description: 'Need a full stack developer for a 3-month contract',
      budget: '4000-6000',
      postedDate: '5 hours ago',
      skillMatch: '85%',
    },
    {
      id: 3,
      title: 'UI/UX Designer for Web App',
      description: 'Redesign the user interface of our existing web application',
      budget: '2500-3500',
      postedDate: '1 day ago',
      skillMatch: '80%',
    },
  ]);

  // Project table columns definition
  const projectColumns = [
    { 
      key: 'title', 
      label: 'Project',
      render: (item) => (
        <div className="text-sm font-medium text-green-600 truncate">{item.title}</div>
      )
    },
    { 
      key: 'client', 
      label: 'Client',
      render: (item) => (
        <div className="text-sm text-gray-500">{item.client}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {item.status}
        </span>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (item) => (
        <div className="text-sm text-gray-500">{item.dueDate}</div>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (item) => (
        <div className="text-sm text-gray-500">${item.budget}</div>
      )
    }
  ];

  // O conteúdo específico do dashboard
  const dashboardContent = (
                <div className="py-6 px-4 sm:px-6 lg:px-8 animate-fadeIn">
                  <div className="bg-white shadow-lg rounded-lg mb-6 transform transition-all duration-300 hover:shadow-xl">
                    <div className="px-4 py-5 sm:p-6 border-l-4 border-green-500">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Complete your profile</h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Your profile is {stats.profileCompleteness}% complete. Complete your profile to improve your chances of getting hired.</p>
                      </div>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${stats.profileCompleteness}%` }}></div>
        </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          Complete Profile
                        </button>
                    </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Stats Overview */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                          <span className="bg-green-100 p-1 rounded-full mr-2">
                            <ChartBarIcon className="h-5 w-5 text-green-600" />
                          </span>
                          Overview
                        </h3>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                          <StatCard 
                            icon={<LightningBoltIcon className="h-6 w-6" />}
                            title="Available Credits"
                            value={stats.availableCredits}
                            iconColor="text-green-500"
                            valueColor="text-green-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<BriefcaseIcon className="h-6 w-6" />}
                            title="Active Projects"
                            value={stats.activeProjects}
                            iconColor="text-green-500"
                            valueColor="text-green-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<UserIcon className="h-6 w-6" />}
                            title="Profile Views"
                            value={stats.profileViews}
                            iconColor="text-green-500"
                            valueColor="text-green-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<ClipboardListIcon className="h-6 w-6" />}
                            title="Completed Projects"
                            value={stats.completedProjects}
                            iconColor="text-green-500"
                            valueColor="text-green-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<CashIcon className="h-6 w-6" />}
                            title="Total Earnings"
                            value={`$${stats.earnings}`}
                            iconColor="text-green-500"
                            valueColor="text-green-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<StarIcon className="h-6 w-6" />}
                            title="Rating"
                            value={stats.rating}
                            subtitle="out of 5"
                            iconColor="text-yellow-400"
                            valueColor="text-green-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                </div>
              </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                          <span className="bg-green-100 p-1 rounded-full mr-2">
                            <ClockIcon className="h-5 w-5 text-green-600" />
                          </span>
                          Upcoming Deadlines
                        </h3>
                      </div>
                      <div>
                        <ul className="divide-y divide-gray-200">
                          {recentProjects.map((project) => (
                            <li key={project.id} className="px-4 py-4 sm:px-6 hover:bg-green-50 transition-colors duration-150">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-green-600 truncate">{project.title}</div>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {project.status}
                                  </p>
                    </div>
                  </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                    {project.client}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                                  <p>
                                    Due <time dateTime={project.dueDate}>{project.dueDate}</time>
                                  </p>
                </div>
              </div>
                            </li>
                          ))}
                        </ul>
                        </div>
                      </div>
                  </div>

                  {/* Recommended Jobs */}
                  <div className="mt-6">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                          <span className="bg-green-100 p-1 rounded-full mr-2">
                            <SearchIcon className="h-5 w-5 text-green-600" />
                          </span>
              Recommended Jobs
                        </h3>
            <a href="#" className="text-green-600 hover:text-green-500 text-sm">View all</a>
                      </div>
          <div>
                      <ul className="divide-y divide-gray-200">
                        {recommendedJobs.map((job) => (
                <li key={job.id} className="px-4 py-4 sm:px-6 hover:bg-green-50 transition-colors duration-150">
                                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-green-600 truncate">{job.title}</div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {job.skillMatch} Match
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <CashIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        ${job.budget}
                      </p>
                        </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                      <p>
                        Posted {job.postedDate}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 mr-2">
                      Apply Now
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                      Save
                    </button>
                        </div>
                      </li>
              ))}
                    </ul>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );

  return (
    <FreelancerLayout>
      {dashboardContent}
    </FreelancerLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 