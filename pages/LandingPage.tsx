
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Globe, ShieldCheck, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-red-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
                <Zap size={16} />
                <span>#1 Platform for Filipino Talent</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                Global Work at <span className="text-blue-600">remotejobs</span>.com.ph
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Connecting world-class Pinoy professionals with premium international job opportunities. 
                Whether you're an OFW or a remote freelancer, your next big break is here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/auth/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200/50 text-center">
                  I Want to Work
                </Link>
                <Link to="/auth/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all text-center">
                  I Want to Hire
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">50k+</div>
                  <div className="text-sm text-slate-500">Active Workers</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">2.5k+</div>
                  <div className="text-sm text-slate-500">Verified Companies</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">12k+</div>
                  <div className="text-sm text-slate-500">Jobs Filled</div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <img src="https://picsum.photos/seed/manila/800/600" alt="Remote Worker" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Verified Skills Platform</div>
                      <div className="text-xs text-slate-600">Secure payments and verified profiles.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose remotejobs.com.ph?</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Built by Filipinos, for Filipinos. We understand the unique excellence and work ethic our community brings to the world stage.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="text-blue-600" size={32} />}
              title="Global Reach"
              description="Access high-paying jobs from the US, UK, Australia, and beyond without leaving your home."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-blue-600" size={32} />}
              title="Trusted Ecosystem"
              description="We verify every employer to ensure safety and legitimate opportunities for all workers."
            />
            <FeatureCard 
              icon={<Zap className="text-blue-600" size={32} />}
              title="AI Matching"
              description="Our Gemini-powered engine matches your unique skills with the perfect role instantly."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
