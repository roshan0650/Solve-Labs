import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Shield, Briefcase, Bell, Loader2, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";

export default function Settings() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    bio: "",
    skills: "",
    interests: "",
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      weeklyDigest: false
    }
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        email: userProfile.email || "",
        bio: userProfile.bio || "",
        skills: userProfile.skills ? userProfile.skills.join(", ") : "",
        interests: userProfile.interests ? userProfile.interests.join(", ") : "",
        notifications: userProfile.notifications || {
          emailAlerts: true,
          pushNotifications: true,
          weeklyDigest: false
        }
      });
    }
  }, [userProfile]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "skills", label: "Skills & Interests", icon: Briefcase },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(",").map(s => s.trim()).filter(s => s),
        notifications: formData.notifications
      });
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) return;
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading italic font-semibold mb-2">Settings</h1>
        <p className="text-black/60 text-lg">Manage your account preferences and profile details.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-sm"
                  : "text-black/60 hover:bg-black/5 hover:text-black"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-white/80" : "text-black/40"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <Card className="glass-card bg-white border-black/5">
              <CardHeader>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-black/5 border border-black/10 overflow-hidden flex items-center justify-center">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-3xl font-medium text-black/40">{userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <Button variant="outline" disabled>Change Avatar</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-black/80">Display Name</label>
                    <Input name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Alex Founder" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-black/80">Email Address</label>
                    <Input name="email" value={formData.email} disabled type="email" />
                    <p className="text-xs text-black/50">Email cannot be changed here.</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-black/80">Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="flex min-h-[100px] w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm ring-offset-background placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm resize-y"
                      placeholder="Passionate about building products that solve real-world problems..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-black/5">
                  <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "skills" && (
            <Card className="glass-card bg-white border-black/5">
              <CardHeader>
                <CardTitle className="text-2xl">Skills & Interests</CardTitle>
                <CardDescription>Tell us what you're good at and what you care about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/80">Skills (comma separated)</label>
                  <Input 
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange} 
                    placeholder="e.g. React, Node.js, UI/UX Design, Marketing" 
                  />
                  <p className="text-xs text-black/50">These help us match you with relevant projects and teams.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/80">Interests (comma separated)</label>
                  <Input 
                    name="interests" 
                    value={formData.interests} 
                    onChange={handleChange} 
                    placeholder="e.g. Climate Change, Education, Healthcare" 
                  />
                  <p className="text-xs text-black/50">What kind of problems are you passionate about solving?</p>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-black/5">
                  <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="glass-card bg-white border-black/5">
              <CardHeader>
                <CardTitle className="text-2xl">Security</CardTitle>
                <CardDescription>Manage your account security and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black/80 mb-1">Password</h4>
                    <p className="text-sm text-black/50">Reset your password via email.</p>
                  </div>
                  <Button variant="outline" onClick={handlePasswordReset} disabled={resetLoading}>
                    {resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                    Reset Password
                  </Button>
                </div>
                
                <div className="p-4 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-between opacity-50">
                  <div>
                    <h4 className="font-medium text-black/80 mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-black/50">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline" disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="glass-card bg-white border-black/5">
              <CardHeader>
                <CardTitle className="text-2xl">Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:bg-black/[0.02] transition-colors">
                    <div>
                      <h4 className="font-medium text-black/80 mb-1">Email Alerts</h4>
                      <p className="text-sm text-black/50">Receive notifications about your projects and team invites.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.notifications.emailAlerts}
                        onChange={() => handleNotificationChange('emailAlerts')}
                      />
                      <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:bg-black/[0.02] transition-colors">
                    <div>
                      <h4 className="font-medium text-black/80 mb-1">Push Notifications</h4>
                      <p className="text-sm text-black/50">Get real-time alerts in your browser.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.notifications.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                      />
                      <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:bg-black/[0.02] transition-colors">
                    <div>
                      <h4 className="font-medium text-black/80 mb-1">Weekly Digest</h4>
                      <p className="text-sm text-black/50">A weekly summary of trending problems and top solutions.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.notifications.weeklyDigest}
                        onChange={() => handleNotificationChange('weeklyDigest')}
                      />
                      <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-black/5">
                  <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
