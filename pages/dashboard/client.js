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
  DocumentTextIcon,
  UserIcon,
  PlusCircleIcon
} from '@heroicons/react/outline';
import { StatCard } from '../../components/dashboard';
import ClientLayout from '../../components/dashboard/ClientLayout';

export default function ClientDashboard() {
  const { t } = useTranslation('common');
  const [stats] = useState({
    activeProjects: 2,
    completedProjects: 5,
    totalSpent: 3800,
    avgRating: 4.9,
    openJobs: 3,
    unreadMessages: 3,
    proposalsReceived: 12,
    ongoingContracts: 2,
  });

  const [activeProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Website Development',
      freelancer: 'John Doe',
      status: 'In Progress',
      dueDate: '2024-05-15',
      budget: 2500,
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      freelancer: 'Sarah Johnson',
      status: 'In Progress',
      dueDate: '2024-05-20',
      budget: 1800,
    },
  ]);
  
  const [topFreelancers] = useState([
    {
      id: 1,
      name: 'Alan Walker',
      title: 'Senior Full Stack Developer',
      rating: 4.9,
      hourlyRate: 45,
      skills: ['React', 'Node.js', 'MongoDB'],
      jobsCompleted: 27,
    },
    {
      id: 2,
      name: 'Jessica Miller',
      title: 'UI/UX Designer',
      rating: 4.8,
      hourlyRate: 40,
      skills: ['Figma', 'Adobe XD', 'Sketch'],
      jobsCompleted: 34,
    },
    {
      id: 3,
      name: 'Michael Chen',
      title: 'Mobile Developer',
      rating: 4.7,
      hourlyRate: 38,
      skills: ['Flutter', 'React Native', 'Swift'],
      jobsCompleted: 19,
    },
  ]);
  
  // O conteúdo específico do dashboard de cliente
  const dashboardContent = (
                <div className="py-6 px-4 sm:px-6 lg:px-8 animate-fadeIn">
                  <div className="bg-white shadow-lg rounded-lg mb-6 transform transition-all duration-300 hover:shadow-xl">
        <div className="px-4 py-5 sm:p-6 border-l-4 border-blue-500">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome back!</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>You have {stats.activeProjects} active projects and {stats.proposalsReceived} new proposals to review.</p>
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
              <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Post a New Job
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stats Overview */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                          <span className="bg-blue-100 p-1 rounded-full mr-2">
                            <ChartBarIcon className="h-5 w-5 text-blue-600" />
                          </span>
              Overview
                        </h3>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                          <StatCard 
                            icon={<BriefcaseIcon className="h-6 w-6" />}
                            title="Active Projects"
                            value={stats.activeProjects}
                            iconColor="text-blue-500"
                valueColor="text-blue-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<DocumentTextIcon className="h-6 w-6" />}
                title="Proposals"
                value={stats.proposalsReceived}
                            iconColor="text-blue-500"
                valueColor="text-blue-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                icon={<ChatIcon className="h-6 w-6" />}
                title="Messages"
                value={stats.unreadMessages}
                            iconColor="text-blue-500"
                valueColor="text-blue-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<BriefcaseIcon className="h-6 w-6" />}
                title="Completed"
                            value={stats.completedProjects}
                            iconColor="text-blue-500"
                valueColor="text-blue-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                            icon={<CashIcon className="h-6 w-6" />}
                            title="Total Spent"
                value={`$${stats.totalSpent}`}
                            iconColor="text-blue-500"
                valueColor="text-blue-600"
                            className="transform transition-all duration-200 hover:scale-105"
                          />
                          <StatCard 
                icon={<StarIcon className="h-6 w-6" />}
                title="Avg. Rating"
                value={stats.avgRating}
                subtitle="out of 5"
                iconColor="text-yellow-400"
                valueColor="text-blue-600"
                          className="transform transition-all duration-200 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Projects */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                          <span className="bg-blue-100 p-1 rounded-full mr-2">
                <ClockIcon className="h-5 w-5 text-blue-600" />
                          </span>
                          Active Projects
                        </h3>
                      </div>
          <div>
                      <ul className="divide-y divide-gray-200">
                        {activeProjects.map((project) => (
                          <li key={project.id} className="px-4 py-4 sm:px-6 hover:bg-blue-50 transition-colors duration-150">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-blue-600 truncate">{project.title}</div>
                              <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {project.status}
                      </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  {project.freelancer}
                                </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500" />
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

                  {/* Top Freelancers */}
                  <div className="mt-6">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                          <span className="bg-blue-100 p-1 rounded-full mr-2">
                <StarIcon className="h-5 w-5 text-blue-600" />
                          </span>
              Top Rated Freelancers
                        </h3>
            <a href="#" className="text-blue-600 hover:text-blue-500 text-sm">View all</a>
                      </div>
          <div>
                      <ul className="divide-y divide-gray-200">
                        {topFreelancers.map((freelancer) => (
                          <li key={freelancer.id} className="px-4 py-4 sm:px-6 hover:bg-blue-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-blue-600">{freelancer.name}</div>
                    <div className="ml-2 flex-shrink-0 flex">
                            <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-xs font-semibold text-gray-700">{freelancer.rating}</span>
                                  </div>
                                  </div>
                                </div>
                  <p className="text-sm text-gray-600 mt-1">{freelancer.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                                  {freelancer.skills.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <p className="flex items-center text-sm text-gray-500">
                      <CashIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      ${freelancer.hourlyRate}/hr
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <BriefcaseIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500" />
                      {freelancer.jobsCompleted} jobs completed
                    </p>
                  </div>
                  <div className="mt-3">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mr-2">
                      Invite to Project
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                      View Profile
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
    <ClientLayout>
      {dashboardContent}
    </ClientLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 