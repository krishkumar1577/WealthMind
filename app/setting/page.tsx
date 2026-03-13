'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { validateEmail, saveToLocalStorage, getFromLocalStorage, clearLocalStorage } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [profileData, setProfileData] = useState({
    fullName: 'Alex Miller',
    email: 'alex.miller@institutional.com',
    currency: 'USD ($)',
    fiscalYear: 'January 1st',
  });

  const [securityData, setSecurityData] = useState({
    twoFAEnabled: true,
    sessionTimeout: '1 hour',
  });

  useEffect(() => {
    const savedProfile = getFromLocalStorage('wealthmind_profile', profileData);
    const savedSecurity = getFromLocalStorage('wealthmind_security', securityData);
    setProfileData(savedProfile);
    setSecurityData(savedSecurity);
  }, []);

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};
    if (!profileData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (profileData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async () => {
    if (!validateProfileForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      saveToLocalStorage('wealthmind_profile', profileData);
      toast.success('Profile updated successfully!');
      setFormErrors({});
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataDownload = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Data download started. Check your downloads folder.');
    } catch (error) {
      toast.error('Failed to download data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      setIsLoading(true);
      setTimeout(() => {
        clearLocalStorage('wealthmind_profile');
        clearLocalStorage('wealthmind_security');
        toast.success('Account deleted successfully');
        router.push('/');
      }, 1500);
    }
  };

  const tabs = [
    { id: 'profile', label: 'PROFILE' },
    { id: 'subscription', label: 'SUBSCRIPTION' },
    { id: 'security', label: 'SECURITY' },
    { id: 'connected', label: 'CONNECTED ACCOUNTS' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-[#f0ece4]">
      <header className="h-16 flex items-center justify-center border-b border-white/[0.06]">
        <span className="text-[10px] font-medium tracking-[0.2em] text-white/[0.4] small-caps">
          SETTINGS
        </span>
      </header>

      <main className="flex flex-1">
        <aside className="w-[240px] border-r border-white/[0.06] flex flex-col py-8 px-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-8 py-3 transition-all ${
                  activeTab === tab.id ? 'relative text-white' : 'opacity-40 hover:opacity-100'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#1a4d38]" />
                )}
                <span className="text-[11px] font-medium tracking-[0.15em] small-caps">
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 overflow-y-auto py-12 px-6 md:px-0">
          <div className="max-w-[680px] mx-auto w-full">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="mb-10">
                  <h2 className="small-caps text-[11px] text-white/[0.4] mb-8">
                    PROFILE &amp; ACCOUNT
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-sm tracking-widest font-light text-white">
                        {profileData.fullName.charAt(0)}{profileData.fullName.charAt(profileData.fullName.lastIndexOf(' ') + 1)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-lg font-medium tracking-tight">{profileData.fullName}</h3>
                        <p className="text-xs text-white/[0.4] font-light">{profileData.email}</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 text-[10px] small-caps border border-white/[0.08] rounded-full hover:bg-white/[0.05] transition-all disabled:opacity-50" disabled={isLoading}>
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06] mb-10" />

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleProfileSubmit(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block small-caps text-[10px] text-white/[0.4]">FULL NAME</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className={`w-full bg-white/[0.03] border ${formErrors.fullName ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-[10px] px-4 py-3 text-sm font-light text-white focus:ring-0 focus:border-[#1a4d38]/40 transition-colors`}
                      />
                      {formErrors.fullName && <p className="text-xs text-red-500">{formErrors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block small-caps text-[10px] text-white/[0.4]">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className={`w-full bg-white/[0.03] border ${formErrors.email ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-[10px] px-4 py-3 text-sm font-light text-white focus:ring-0 focus:border-[#1a4d38]/40 transition-colors`}
                      />
                      {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block small-caps text-[10px] text-white/[0.4]">DISPLAY CURRENCY</label>
                      <select value={profileData.currency} onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[10px] px-4 py-3 text-sm font-light text-white focus:ring-0 focus:border-[#1a4d38]/40 transition-colors appearance-none">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>CHF (Fr)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block small-caps text-[10px] text-white/[0.4]">FISCAL YEAR START</label>
                      <select value={profileData.fiscalYear} onChange={(e) => setProfileData({ ...profileData, fiscalYear: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[10px] px-4 py-3 text-sm font-light text-white focus:ring-0 focus:border-[#1a4d38]/40 transition-colors appearance-none">
                        <option>January 1st</option>
                        <option>April 1st</option>
                        <option>July 1st</option>
                        <option>October 1st</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button type="submit" disabled={isLoading} className="px-8 py-2.5 text-[10px] small-caps border border-[#1a4d38]/30 bg-[#1a4d38]/10 text-[#1a4d38] rounded-full hover:bg-[#1a4d38]/20 transition-all disabled:opacity-50">
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div>
                <div className="mb-10">
                  <h2 className="small-caps text-[11px] text-white/[0.4] mb-8">SUBSCRIPTION &amp; BILLING</h2>
                  <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-3 h-3 text-[#1a4d38]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="small-caps text-[10px] text-[#1a4d38]">PRO PLAN</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[18px] font-mono text-[#f0ece4]">$29 / month</span>
                        </div>
                        <p className="text-[12px] text-white/[0.4] font-light">Renews March 22, 2025</p>
                      </div>
                    </div>
                    <button onClick={() => toast.success('Redirecting to billing portal...')} className="px-5 py-2 text-[10px] small-caps border border-white/[0.08] rounded-full hover:bg-white/[0.05] transition-all opacity-80 hover:opacity-100">
                      Manage Billing
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06] mb-10" />

                <div className="border-l-2 border-[#1a4d38] pl-6 py-1 mb-12">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="small-caps text-[11px] text-white">PRIVATE CLIENT PLAN</h3>
                      <p className="text-sm text-white/[0.4] font-light">Dedicated advisor integration, unlimited reports, and priority processing.</p>
                    </div>
                    <button onClick={() => toast.success('Contacting sales team...')} className="px-5 py-2 text-[10px] small-caps border border-[#1a4d38]/40 rounded-full hover:bg-[#1a4d38]/10 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="small-caps text-[10px] text-white/[0.4]">BILLING HISTORY</h3>
                  <div className="overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] small-caps text-white/[0.3]">
                          <th className="pb-4 font-medium">Date</th>
                          <th className="pb-4 font-medium">Description</th>
                          <th className="pb-4 font-medium text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-light text-white/[0.4]">
                        <tr className="border-b border-white/[0.06]">
                          <td className="py-4">Feb 22, 2025</td>
                          <td className="py-4">Wealthmind Pro - Monthly Subscription</td>
                          <td className="py-4 text-right font-mono text-[#f0ece4]">$29.00</td>
                        </tr>
                        <tr className="border-b border-white/[0.06]">
                          <td className="py-4">Jan 22, 2025</td>
                          <td className="py-4">Wealthmind Pro - Monthly Subscription</td>
                          <td className="py-4 text-right font-mono text-[#f0ece4]">$29.00</td>
                        </tr>
                        <tr className="border-b border-white/[0.06]">
                          <td className="py-4">Dec 22, 2024</td>
                          <td className="py-4">Wealthmind Pro - Monthly Subscription</td>
                          <td className="py-4 text-right font-mono text-[#f0ece4]">$29.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="pt-4">
                    <button onClick={() => toast.success('Loading full invoice history...')} className="px-5 py-2 text-[10px] small-caps border border-white/[0.08] rounded-full hover:bg-white/[0.05] transition-all opacity-60 hover:opacity-100">
                      View All Invoices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <div className="mb-8">
                  <h2 className="small-caps text-[11px] text-white/[0.4] mb-6 tracking-[0.2em]">SECURITY &amp; PRIVACY</h2>
                  <div className="h-[1px] bg-white/[0.06]" />
                </div>

                <div className="divide-y divide-white/[0.06]">
                  <div className="py-6 flex items-center justify-between">
                    <span className="small-caps text-[11px] text-white/[0.4]">TWO-FACTOR AUTHENTICATION</span>
                    <div className="flex items-center gap-4">
                      <span className="small-caps text-[10px] text-[#1a4d38]">{securityData.twoFAEnabled ? 'ENABLED' : 'DISABLED'}</span>
                      <button onClick={() => { setSecurityData({ ...securityData, twoFAEnabled: !securityData.twoFAEnabled }); toast.success(securityData.twoFAEnabled ? '2FA disabled' : '2FA enabled'); }} className="px-4 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-full text-[13px] text-white hover:bg-white/[0.08] transition-colors">
                        {securityData.twoFAEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  <div className="py-6 flex items-center justify-between">
                    <span className="small-caps text-[11px] text-white/[0.4]">SESSION TIMEOUT</span>
                    <select value={securityData.sessionTimeout} onChange={(e) => { setSecurityData({ ...securityData, sessionTimeout: e.target.value }); toast.success(`Session timeout set to ${e.target.value}`); }} className="appearance-none bg-white/[0.03] border border-white/[0.08] rounded-[10px] px-4 py-2 text-sm text-white focus:ring-0 focus:border-[#1a4d38]/40 min-w-[120px] cursor-pointer">
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>24 hours</option>
                    </select>
                  </div>

                  <div className="py-6 flex items-center justify-between">
                    <span className="small-caps text-[11px] text-white/[0.4]">DATA &amp; PRIVACY</span>
                    <div className="flex items-center gap-3">
                      <button onClick={handleDataDownload} disabled={isLoading} className="px-4 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-full text-[12px] text-white hover:bg-white/[0.08] transition-colors disabled:opacity-50">
                        {isLoading ? 'Downloading...' : 'Download My Data'}
                      </button>
                      <button onClick={handleAccountDelete} disabled={isLoading} className="px-4 py-1.5 bg-white/[0.05] border border-[#c4773a]/20 rounded-full text-[12px] text-[#c4773a] hover:bg-[#c4773a]/5 transition-colors disabled:opacity-50">
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="small-caps text-[11px] font-light text-white/[0.4] opacity-60 tracking-widest">
                    FILES ARE ENCRYPTED IN TRANSIT AND AT REST · NEVER SHARED · DELETED AFTER 30 DAYS
                  </p>
                </div>
              </div>
            )}

            {/* Connected Accounts Tab */}
            {activeTab === 'connected' && (
              <div>
                <header className="mb-10">
                  <h2 className="text-white/[0.4] text-[12px] small-caps tracking-[0.2em]">CONNECTED ACCOUNTS &amp; INTEGRATIONS</h2>
                </header>

                <div className="flex flex-col divide-y divide-white/[0.06]">
                  {[
                    { name: 'PLAID', icon: '⚙️', connected: true },
                    { name: 'BANK SYNC', icon: '🏦', connected: true },
                    { name: 'QUICKBOOKS', icon: '📊', connected: false },
                    { name: 'STRIPE', icon: '💳', connected: true },
                    { name: 'GOOGLE DRIVE', icon: '📁', connected: false },
                    { name: 'DROPBOX', icon: '📦', connected: false },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between py-6">
                      <div className="flex items-center gap-5">
                        <div className="text-2xl">{integration.icon}</div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium">{integration.name}</span>
                          <span className="text-[12px] text-white/[0.4]">Sync transactions and balances automatically.</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-[11px] small-caps ${integration.connected ? 'text-[#34d399]' : 'text-white/[0.3]'}`}>
                          {integration.connected ? '✓ Connected' : 'Not Connected'}
                        </span>
                        <button onClick={() => { const action = integration.connected ? 'Disconnected from' : 'Connected to'; toast.success(`${action} ${integration.name}`); }} className={`px-4 py-1.5 rounded-full border text-[11px] small-caps hover:opacity-80 transition-all ${integration.connected ? 'border-white/[0.1] text-white hover:bg-white/[0.05]' : 'border-[#1a4d38]/40 text-[#1a4d38] hover:bg-[#1a4d38]/10'}`}>
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="mt-12 flex items-center justify-between">
                  <div className="text-[10px] small-caps text-white/[0.4] tracking-widest">More integrations coming · Request an integration</div>
                  <button className="size-8 rounded-full border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.05] transition-all">→</button>
                </footer>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
