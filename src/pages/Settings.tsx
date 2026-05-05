import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  User,
  School,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Upload
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: SettingsTab[] = [
  { id: 'institute', label: 'Institute', icon: School },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('institute');
  const { theme, toggleTheme } = useTheme();
  
  const [instituteData, setInstituteData] = useState({
    name: 'Chittagong Model School & College',
    nameBn: 'চট্টগ্রাম মডেল স্কুল এন্ড কলেজ',
    address: 'Agrabad, Chittagong, Bangladesh',
    phone: '+880-31-123456',
    email: 'info@cmsc.edu.bd',
    website: 'www.cmsc.edu.bd',
    principalName: 'Dr. Abdul Karim',
    establishedYear: '1985'
  });

  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@cmsc.edu.bd',
    phone: '+880-1711-123456',
    role: 'Super Admin'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    feeReminders: true,
    attendanceAlerts: true,
    examNotifications: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'institute':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Institute Information</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Institute Name (English)</Label>
                    <Input value={instituteData.name} onChange={(e) => setInstituteData({...instituteData, name: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Institute Name (Bangla)</Label>
                    <Input value={instituteData.nameBn} onChange={(e) => setInstituteData({...instituteData, nameBn: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Address</Label>
                  <Input value={instituteData.address} onChange={(e) => setInstituteData({...instituteData, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input value={instituteData.phone} onChange={(e) => setInstituteData({...instituteData, phone: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={instituteData.email} onChange={(e) => setInstituteData({...instituteData, email: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Website</Label>
                    <Input value={instituteData.website} onChange={(e) => setInstituteData({...instituteData, website: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Established Year</Label>
                    <Input value={instituteData.establishedYear} onChange={(e) => setInstituteData({...instituteData, establishedYear: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Principal Name</Label>
                  <Input value={instituteData.principalName} onChange={(e) => setInstituteData({...instituteData, principalName: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Institute Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                      <School className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Change Photo
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <Input value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Input value={profileData.role} disabled className="bg-muted" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch checked={notifications.emailNotifications} onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch checked={notifications.smsNotifications} onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch checked={notifications.pushNotifications} onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Fee Reminders</p>
                    <p className="text-sm text-muted-foreground">Get alerts for pending fee payments</p>
                  </div>
                  <Switch checked={notifications.feeReminders} onCheckedChange={(checked) => setNotifications({...notifications, feeReminders: checked})} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Attendance Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about attendance issues</p>
                  </div>
                  <Switch checked={notifications.attendanceAlerts} onCheckedChange={(checked) => setNotifications({...notifications, attendanceAlerts: checked})} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Exam Notifications</p>
                    <p className="text-sm text-muted-foreground">Get updates about upcoming exams</p>
                  </div>
                  <Switch checked={notifications.examNotifications} onCheckedChange={(checked) => setNotifications({...notifications, examNotifications: checked})} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch checked={security.twoFactorAuth} onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" value={security.sessionTimeout} onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Password Expiry (days)</Label>
                    <Input type="number" value={security.passwordExpiry} onChange={(e) => setSecurity({...security, passwordExpiry: e.target.value})} />
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="font-medium text-foreground mb-2">Change Password</p>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="grid gap-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button className="w-fit">Update Password</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="font-medium text-foreground mb-4">Theme Colors</p>
                  <div className="grid grid-cols-4 gap-4">
                    <button className="w-full aspect-square rounded-xl bg-primary border-2 border-primary ring-2 ring-offset-2 ring-primary" />
                    <button className="w-full aspect-square rounded-xl bg-blue-600 border-2 border-transparent hover:border-blue-600" />
                    <button className="w-full aspect-square rounded-xl bg-purple-600 border-2 border-transparent hover:border-purple-600" />
                    <button className="w-full aspect-square rounded-xl bg-green-600 border-2 border-transparent hover:border-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Language Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Display Language</Label>
                  <select className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Date Format</Label>
                  <select className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Currency</Label>
                  <select className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="bdt">৳ BDT (Bangladeshi Taka)</option>
                    <option value="usd">$ USD (US Dollar)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Settings</h1>
          <p className="page-subtitle">Manage your institute and application settings</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
