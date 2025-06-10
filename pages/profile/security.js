import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  LockClosedIcon, 
  KeyIcon, 
  ShieldCheckIcon, 
  DeviceMobileIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  UserIcon
} from '@heroicons/react/outline';
import { Header } from '../../components/dashboard';
import { toast } from 'react-hot-toast';

export default function SecuritySettings() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [setting2FA, setSetting2FA] = useState(false);
  const [confirming2FA, setConfirming2FA] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSetupTwoFactor, setShowSetupTwoFactor] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          router.push('/auth/login');
          return;
        }

        const userData = await res.json();
        setUser(userData);
        setIsAdmin(userData.role === 'ADMIN');
        setTwoFactorEnabled(userData.profile?.twoFactorEnabled || false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validação dos campos
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (res.ok) {
        setPasswordSuccess('Password changed successfully');
        setPasswordError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Password updated successfully!');
      } else {
        const error = await res.json();
        setPasswordError(error.message || 'Error changing password');
        setPasswordSuccess('');
        toast.error(error.message || 'Error changing password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Error processing your request');
      setPasswordSuccess('');
      toast.error('Error processing your request');
    } finally {
      setChangingPassword(false);
    }
  };

  const setupTwoFactor = async () => {
    setSetting2FA(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/setup-2fa', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setQrCode(data.qrCode);
        setShowSetupTwoFactor(true);
      } else {
        const error = await res.json();
        toast.error(error.message || 'Error setting up 2FA');
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Error setting up 2FA');
    } finally {
      setSetting2FA(false);
    }
  };

  const confirmTwoFactor = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setTwoFactorError('Please enter a valid 6-digit code');
      return;
    }

    setConfirming2FA(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/confirm-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: twoFactorCode
        })
      });

      if (res.ok) {
        setTwoFactorEnabled(true);
        setShowSetupTwoFactor(false);
        setTwoFactorCode('');
        setTwoFactorError('');
        toast.success('Two-factor authentication enabled successfully');
      } else {
        const error = await res.json();
        setTwoFactorError(error.message || 'Invalid code. Please try again.');
        toast.error(error.message || 'Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming 2FA:', error);
      setTwoFactorError('Error processing your request');
      toast.error('Error processing your request');
    } finally {
      setConfirming2FA(false);
    }
  };

  const disableTwoFactor = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/disable-2fa', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setTwoFactorEnabled(false);
        toast.success('Two-factor authentication disabled');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Error disabling 2FA');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Error disabling 2FA');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchPlaceholder="Buscar..." 
        onSearch={() => {}} 
        notificationCount={2}
        messageCount={3}
      />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your credentials and security options
              </p>
            </div>
            <button
              onClick={() => isAdmin ? router.push('/dashboard/admin/profile') : router.push('/dashboard/profile')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <UserIcon className="h-4 w-4 mr-2" /> Back to Profile
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-500">
                We recommend using a strong, unique password
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                {passwordError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{passwordError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">{passwordSuccess}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="current-password"
                      name="current-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Use at least 8 characters with a mix of letters, numbers, and symbols.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changingPassword ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="h-5 w-5 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {!twoFactorEnabled && !showSetupTwoFactor && (
                <div>
                  <div className="rounded-md bg-yellow-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">
                          Two-factor authentication is not enabled
                        </p>
                        <p className="mt-1 text-sm text-yellow-700">
                          Two-factor authentication adds an extra layer of security to your account by requiring something beyond your password to sign in.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={setupTwoFactor}
                    disabled={setting2FA}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {setting2FA ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting Up...
                      </>
                    ) : (
                      <>
                        <KeyIcon className="h-5 w-5 mr-2" />
                        Set Up Two-Factor Authentication
                      </>
                    )}
                  </button>
                </div>
              )}

              {showSetupTwoFactor && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900">Authenticator Setup</h4>
                  <p className="text-sm text-gray-500">
                    1. Install an authenticator app such as Google Authenticator, Authy, or Microsoft Authenticator on your mobile device.
                  </p>
                  <p className="text-sm text-gray-500">
                    2. Scan the QR code below with your authenticator app.
                  </p>

                  <div className="flex justify-center my-6">
                    {qrCode && (
                      <img src={qrCode} alt="QR Code" className="border p-2 shadow-sm" />
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    3. Enter the 6-digit code displayed in your app to verify the setup.
                  </p>

                  {twoFactorError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">{twoFactorError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="twoFactorCode"
                        name="twoFactorCode"
                        type="text"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="123456"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={confirmTwoFactor}
                      disabled={confirming2FA}
                      className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {confirming2FA ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        "Verify and Enable"
                      )}
                    </button>
                    <button
                      onClick={() => setShowSetupTwoFactor(false)}
                      className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {twoFactorEnabled && !showSetupTwoFactor && (
                <div>
                  <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Two-factor authentication is enabled
                        </p>
                        <p className="mt-1 text-sm text-green-700">
                          Your account is protected with an additional layer of security.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={disableTwoFactor}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Disable Two-Factor Authentication
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Devices where you're currently logged in
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <DeviceMobileIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Windows 10 • Chrome</p>
                        <p className="text-xs text-gray-500">IP: 192.168.1.1 • Last access: Now</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Current</div>
                  </div>
                </li>
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <DeviceMobileIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Android • Chrome Mobile</p>
                        <p className="text-xs text-gray-500">IP: 187.54.23.144 • Last access: 2 days ago</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-800">End Session</button>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                  End All Other Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 