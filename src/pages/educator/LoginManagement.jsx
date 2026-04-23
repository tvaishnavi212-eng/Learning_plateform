import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { educatorAPI } from '../../services/apiService';

const LoginManagement = () => {
  const [activeTab, setActiveTab] = useState('login-activity');
  const [loginHistory, setLoginHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    sessionTimeout: 30,
    allowedDevices: 3
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching login history
    const mockLoginHistory = [
      {
        id: 1,
        date: new Date().toISOString(),
        ip: '192.168.1.100',
        device: 'Chrome on Windows',
        location: 'Mumbai, India',
        status: 'success'
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(),
        ip: '192.168.1.101',
        device: 'Safari on iPhone',
        location: 'Delhi, India',
        status: 'success'
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000).toISOString(),
        ip: '10.0.0.1',
        device: 'Firefox on Mac',
        location: 'Bangalore, India',
        status: 'failed'
      }
    ];

    const mockActiveSessions = [
      {
        id: 1,
        device: 'Chrome on Windows',
        location: 'Mumbai, India',
        ip: '192.168.1.100',
        lastActive: new Date().toISOString(),
        current: true
      },
      {
        id: 2,
        device: 'Safari on iPhone',
        location: 'Delhi, India',
        ip: '192.168.1.101',
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        current: false
      }
    ];

    setLoginHistory(mockLoginHistory);
    setActiveSessions(mockActiveSessions);
  }, []);

  const handleLogoutSession = async (sessionId) => {
    try {
      setLoading(true);
      // In real implementation, this would call your backend API
      // await educatorAPI.logoutSession(sessionId);
      
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      setSuccess('Session terminated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to terminate session');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      setLoading(true);
      // In real implementation, this would call your backend API
      // await educatorAPI.logoutAllSessions();
      
      setActiveSessions([]);
      setSuccess('All sessions terminated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to terminate all sessions');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySettingsUpdate = async (newSettings) => {
    try {
      setLoading(true);
      // In real implementation, this would call your backend API
      // await educatorAPI.updateSecuritySettings(newSettings);
      
      setSecuritySettings(newSettings);
      setSuccess('Security settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update security settings');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBg = (status) => {
    return status === 'success' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Login Management</h1>
                <p className="text-gray-600">Manage your account security and login sessions</p>
              </div>
            </div>
            <Link 
              to="/educator"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex space-x-1 border-b border-gray-200">
            {[
              { id: 'login-activity', label: 'Login Activity', icon: '📊' },
              { id: 'active-sessions', label: 'Active Sessions', icon: '🖥️' },
              { id: 'security-settings', label: 'Security Settings', icon: '🔒' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Login Activity Tab */}
          {activeTab === 'login-activity' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Login Activity</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loginHistory.map((login) => (
                      <tr key={login.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(login.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {login.device}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {login.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {login.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBg(login.status)} ${getStatusColor(login.status)}`}>
                            {login.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Active Sessions Tab */}
          {activeTab === 'active-sessions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Sessions</h2>
                <button
                  onClick={handleLogoutAllSessions}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Terminating...' : 'Terminate All Sessions'}
                </button>
              </div>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{session.device}</div>
                          <div className="text-sm text-gray-500">
                            {session.location} • {session.ip}
                          </div>
                          <div className="text-xs text-gray-400">
                            Last active: {formatDate(session.lastActive)}
                          </div>
                          {session.current && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              Current Session
                            </span>
                          )}
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => handleLogoutSession(session.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security-settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => handleSecuritySettingsUpdate({
                        ...securitySettings,
                        twoFactorEnabled: !securitySettings.twoFactorEnabled
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                    </div>
                    <button
                      onClick={() => handleSecuritySettingsUpdate({
                        ...securitySettings,
                        emailNotifications: !securitySettings.emailNotifications
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Session Timeout */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Session Timeout</h3>
                      <p className="text-sm text-gray-500">Automatically log out after period of inactivity</p>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecuritySettingsUpdate({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value)
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={240}>4 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>
                </div>

                {/* Allowed Devices */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Maximum Allowed Devices</h3>
                      <p className="text-sm text-gray-500">Limit the number of concurrent sessions</p>
                    </div>
                    <select
                      value={securitySettings.allowedDevices}
                      onChange={(e) => handleSecuritySettingsUpdate({
                        ...securitySettings,
                        allowedDevices: parseInt(e.target.value)
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={1}>1 device</option>
                      <option value={2}>2 devices</option>
                      <option value={3}>3 devices</option>
                      <option value={5}>5 devices</option>
                      <option value={10}>Unlimited</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginManagement;
