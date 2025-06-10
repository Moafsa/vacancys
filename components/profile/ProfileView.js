import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  BriefcaseIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  OfficeBuildingIcon,
  InformationCircleIcon
} from '@heroicons/react/outline';

export default function ProfileView({ user, userType = 'user' }) {
  // Get profile based on user type
  const profile = 
    userType === 'freelancer' 
      ? user.freelancerProfile 
      : userType === 'client' 
        ? user.clientProfile 
        : user;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-700 h-32 w-full relative">
        <div className="absolute -bottom-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-16 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            {userType === 'freelancer' && profile?.title && (
              <p className="text-gray-600">{profile.title}</p>
            )}
            {userType === 'client' && profile?.companyName && (
              <p className="text-gray-600">{profile.companyName}</p>
            )}
          </div>
          
          {userType === 'freelancer' && (
            <div className="flex items-center mt-2 md:mt-0">
              <CurrencyDollarIcon className="h-5 w-5 text-indigo-600 mr-1" />
              <span className="font-medium">
                {profile?.hourlyRate ? `$${profile.hourlyRate}/hr` : 'Hourly rate not set'}
              </span>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
          <p className="text-gray-600 mb-6">
            {profile?.bio || 'No biography available.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <MailIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>
            
            {profile?.phone && (
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{profile.phone}</p>
                </div>
              </div>
            )}
            
            {profile?.location && (
              <div className="flex items-start">
                <LocationMarkerIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-800">{profile.location}</p>
                </div>
              </div>
            )}
            
            {userType === 'freelancer' && profile?.availability && (
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="text-gray-800">{profile.availability}</p>
                </div>
              </div>
            )}
            
            {userType === 'client' && profile?.industry && (
              <div className="flex items-start">
                <OfficeBuildingIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-gray-800">{profile.industry}</p>
                </div>
              </div>
            )}
          </div>
          
          {userType === 'freelancer' && profile?.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 