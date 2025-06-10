import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  CameraIcon,
  SaveIcon,
} from '@heroicons/react/outline';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import AccountVerification from './AccountVerification';

export default function ProfileEditor({ user, userType = 'user', onProfileUpdate }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    hourlyRate: '',
    availability: '',
    companyName: '',
    industry: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Log initial props for debugging
  useEffect(() => {
    console.log('ProfileEditor - Initial props:', { user, userType });
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.freelancerProfile?.skills || [],
        hourlyRate: user.freelancerProfile?.hourlyRate || '',
        availability: user.freelancerProfile?.availability || '',
        companyName: user.clientProfile?.companyName || '',
        industry: user.clientProfile?.industry || '',
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData({
      ...formData,
      skills
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('ProfileEditor - File selected:', { 
      name: file.name, 
      type: file.type, 
      size: `${(file.size / 1024).toFixed(2)} KB` 
    });

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.invalidFileFormat'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.imageSizeLimit'));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      // Atualiza dados principais sempre
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('bio', formData.bio || '');
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append('avatar', fileInputRef.current.files[0]);
      }
      await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });
      // Criação/atualização de perfis específicos
      if (userType === 'freelancer') {
        // Se não existe freelancerProfile, cria
        if (!user.freelancerProfile) {
          await fetch('/api/v1/users/profile/freelancer', {
            method: 'POST',
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              skills: formData.skills,
              hourlyRate: formData.hourlyRate,
              availability: formData.availability
            })
          });
        } else {
          // Atualiza
          await fetch('/api/v1/users/profile/freelancer', {
            method: 'PUT',
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              skills: formData.skills,
              hourlyRate: formData.hourlyRate,
              availability: formData.availability
            })
          });
        }
      } else if (userType === 'client') {
        if (!user.clientProfile) {
          await fetch('/api/v1/users/profile/client', {
            method: 'POST',
              headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              companyName: formData.companyName,
              industry: formData.industry
            })
          });
      } else {
          await fetch('/api/v1/users/profile/client', {
            method: 'PUT',
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              companyName: formData.companyName,
              industry: formData.industry
            })
          });
        }
      }
      // Buscar dados atualizados
      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedUser = await res.json();
        if (onProfileUpdate) onProfileUpdate(updatedUser);
      }
      toast.success(t('profile.updateSuccess'));
    } catch (error) {
      toast.error(t('profile.updateError'));
    } finally {
      setSaving(false);
    }
  };

  // Render different fields based on user type
  const renderUserTypeFields = () => {
    if (userType === 'freelancer') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.skills')}
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={t('profile.skillsPlaceholder')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.hourlyRate')}
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={t('profile.hourlyRatePlaceholder')}
            />
          </div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('profile.availability')}
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
            <option value="">{t('profile.selectAvailability')}</option>
            <option value="Full-time">{t('profile.fullTime')}</option>
            <option value="Part-time">{t('profile.partTime')}</option>
            <option value="Weekends">{t('profile.weekends')}</option>
            <option value="Flexible">{t('profile.flexible')}</option>
            </select>
        </>
      );
    } else if (userType === 'client') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.companyName')}
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={t('profile.companyNamePlaceholder')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.industry')}
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={t('profile.industryPlaceholder')}
            />
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* Account Verification Section */}
      <AccountVerification verificationStatus={user?.accountVerification?.status} onSubmitted={() => {}} />
      {/* Existing profile editor UI */}
    <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">{t('profile.editTitle')}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex flex-col items-center">
          <div 
            className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden relative cursor-pointer"
            onClick={handleAvatarClick}
          >
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                  alt={t('profile.avatarAlt')} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <CameraIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg, image/png, image/gif"
          />
            <span className="text-sm text-gray-500">{t('profile.avatarHint')}</span>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.fullName')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
                placeholder={t('profile.fullNamePlaceholder')}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.email')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-500 bg-gray-100 leading-tight"
            />
          </div>
            <p className="text-xs text-gray-500 mt-1">{t('profile.emailHint')}</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.phone')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={t('profile.phonePlaceholder')}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.location')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={t('profile.locationPlaceholder')}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('profile.bio')}
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
              placeholder={t('profile.bioPlaceholder')}
          ></textarea>
        </div>
        
        {renderUserTypeFields()}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                  {t('profile.saving')}
              </>
            ) : (
              <>
                <SaveIcon className="h-5 w-5 mr-2" />
                  {t('profile.saveButton')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </>
  );
} 