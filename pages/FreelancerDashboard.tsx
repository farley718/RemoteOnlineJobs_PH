
import React, { useState, useEffect } from 'react';
import { User, Job, Application } from '../types';
import { storage } from '../services/storage';
import { suggestResumeImprovements } from '../services/geminiService';
import { Search, MapPin, DollarSign, Calendar, Star, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const FreelancerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'find' | 'applications' | 'profile'>('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiTips, setAiTips] = useState<string>('');
  const [loadingTips, setLoadingTips] = useState(false);

  useEffect(() => {
    setJobs(storage.getJobs());
    setApplications(storage.getApplications().filter(a => a.freelancerId === user.id));
  }, [user.id]);

  const handleApply = (jobId: string) => {
    if (applications.some(a => a.jobId === jobId)) return;

    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      freelancerId: user.id,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };
    storage.applyForJob(newApp);
    setApplications([...applications, newApp]);
  };

  const getAiHelp = async () => {
    setLoadingTips(true);
    const tips = await suggestResumeImprovements(user.bio || "Passionate worker looking for growth.", user.skills || ["Customer Support"]);
    setAiTips(tips);
    setLoadingTips(false);
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('find')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'find' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Search size={20} />
            Find Jobs
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Calendar size={20} />
            My Applications
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Star size={20} />
            Profile & AI Coach
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'find' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search for roles, skills, or companies..." 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">No jobs found. Try adjusting your search.</p>
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors shadow-sm group">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <p className="text-slate-600 font-medium mt-1">Global Tech Solutions</p>
                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <MapPin size={16} />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <DollarSign size={16} />
                              {job.salary}
                            </div>
                            <div className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase">
                              {job.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            disabled={applications.some(a => a.jobId === job.id)}
                            onClick={() => handleApply(job.id)}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${
                              applications.some(a => a.jobId === job.id) 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-95'
                            }`}
                          >
                            {applications.some(a => a.jobId === job.id) ? 'Applied' : 'Apply Now'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-50">
                        <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Track Your Journey</h2>
              {applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500">You haven't applied to any jobs yet.</p>
                  <button onClick={() => setActiveTab('find')} className="mt-4 text-blue-600 font-bold hover:underline">Start Browsing</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);
                    return (
                      <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            app.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                            app.status === 'Accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {app.status}
                          </div>
                          <span className="text-xs text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg">{job?.title || 'Unknown Position'}</h4>
                        <p className="text-sm text-slate-500 mt-1">Global Client • Remote</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-slate-500">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">FILIPINO EXCELLENCE</span>
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Bio</h3>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    defaultValue={user.bio || "Write something about yourself..."}
                    placeholder="Tell global employers why you are the best fit..."
                  />
                  <div className="flex justify-end">
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">Update Profile</button>
                  </div>
                </div>
              </div>

              {/* AI Coaching Section */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-xl text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={24} className="text-blue-200" />
                    <h3 className="text-2xl font-bold">remotejobs.com.ph AI Coach</h3>
                  </div>
                  <p className="text-blue-100 mb-6 max-w-lg">Get personalized, AI-powered tips to stand out to international recruiters based on your profile.</p>
                  
                  {loadingTips ? (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-6">
                      <Loader2 className="animate-spin" size={24} />
                      <span className="font-medium">AI is analyzing your profile...</span>
                    </div>
                  ) : aiTips ? (
                    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                       <div className="whitespace-pre-wrap text-sm leading-relaxed text-blue-50 prose prose-invert">
                        {aiTips}
                       </div>
                       <button onClick={getAiHelp} className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-200 hover:text-white transition-colors">Regenerate Tips</button>
                    </div>
                  ) : (
                    <button 
                      onClick={getAiHelp}
                      className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                      Analyze My Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
