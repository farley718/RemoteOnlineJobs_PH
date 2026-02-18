
import { User, Job, Application } from '../types';

const USERS_KEY = 'pinoywork_users';
const JOBS_KEY = 'pinoywork_jobs';
const APPS_KEY = 'pinoywork_apps';

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getJobs: (): Job[] => JSON.parse(localStorage.getItem(JOBS_KEY) || '[]'),
  setJobs: (jobs: Job[]) => localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)),
  
  getApplications: (): Application[] => JSON.parse(localStorage.getItem(APPS_KEY) || '[]'),
  setApplications: (apps: Application[]) => localStorage.setItem(APPS_KEY, JSON.stringify(apps)),

  saveJob: (job: Job) => {
    const jobs = storage.getJobs();
    jobs.push(job);
    storage.setJobs(jobs);
  },

  applyForJob: (app: Application) => {
    const apps = storage.getApplications();
    apps.push(app);
    storage.setApplications(apps);
  }
};
