
import React, { useState, useEffect } from 'react';
import { User, Job, Application, Role } from '../types';
import { storage } from '../services/storage';
import { generateJobDescription } from '../services/geminiService';
import { PlusCircle, List, Users, Sparkles, Loader2, Send, MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';

const EmployerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'manage' | 'post' | 'applicants'>('manage');
  
  // New Job State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Part-time' | 'Contract'>('Full-time');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setJobs(storage.getJobs().filter(j => j.employerId === user.id));
    setApplications(storage.getApplications());
  }, [user.id]);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: Job = {
      id: Math.random().toString(36).substr(2, 9),
      employerId: user.id,
      title: newJobTitle,
      description: newJobDesc,
      salary: newJobSalary,
      type: newJobType,
      location: 'Remote (Philippines)',
      postedAt: new Date().toISOString(),
      requirements: [],
    };
    storage.saveJob(job);
    setJobs([...jobs, job]);
    setActiveTab('manage');
    setNewJobTitle('');
    setNewJobDesc('');
    setNewJobSalary('');
  };

  const handleAiWrite = async () => {
    if (!newJobTitle) return alert("Please enter a job title first!");
    setIsGenerating(true);
    const desc = await generateJobDescription(newJobTitle, user.companyName || user.name);
    setNewJobDesc(desc);
    setIsGenerating(false);
  };

  const employerApps = applications.filter(app => jobs.some(j => j.id === app.jobId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'manage' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <List size={20} />
            My Job Posts
          </button>
          <button 
            onClick={() => setActiveTab('post')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'post' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <PlusCircle size={20} />
            Post New Job
          </button>
          <button 
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'applicants' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Users size={20} />
            View Applicants
            {employerApps.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {employerApps.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Manage Your Listings</h2>
                <button 
                  onClick={() => setActiveTab('post')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <PlusCircle size={18} />
                  New Posting
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">You haven't posted any jobs yet.</p>
                  </div>
                ) : (
                  jobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                        <div className="flex gap-4 mt-2">
                          {/* Fixed: Calendar icon is now imported correctly */}
                          <span className="text-sm text-slate-500 flex items-center gap-1"><Calendar size={14}/> {new Date(job.postedAt).toLocaleDateString()}</span>
                          <span className="text-sm text-slate-500 flex items-center gap-1"><Briefcase size={14}/> {job.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-center px-4">
                          <div className="text-xl font-bold text-blue-600">{applications.filter(a => a.jobId === job.id).length}</div>
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Apps</div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'post' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Post a New Opportunity</h2>
              
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Job Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Senior Virtual Assistant"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Employment Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newJobType}
                      onChange={(e) => setNewJobType(e.target.value as any)}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Description</label>
                    <button 
                      type="button"
                      onClick={handleAiWrite}
                      disabled={isGenerating || !newJobTitle}
                      className="flex items-center gap-2 text-sm text-blue-600 font-bold hover:text-blue-700 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      AI Generator
                    </button>
                  </div>
                  <textarea 
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Describe the role, responsibilities, and why a Filipino professional would love this job..."
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Monthly Salary Range (USD)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $800 - $1,200"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                    Publish to Network
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Review Global Talent</h2>
              {employerApps.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500">No applications received yet. Try promoting your job posts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {employerApps.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);
                    const freelancer = storage.getUsers().find(u => u.id === app.freelancerId);
                    return (
                      <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {freelancer?.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{freelancer?.name}</h4>
                            <p className="text-sm text-slate-500">Applying for <span className="text-blue-600 font-semibold">{job?.title}</span></p>
                            <p className="text-xs text-slate-400 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-5 py-2 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-colors">Accept</button>
                          <button className="px-5 py-2 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors">Decline</button>
                          <button className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">Message</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
