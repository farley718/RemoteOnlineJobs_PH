
export enum Role {
  FREELANCER = 'FREELANCER',
  EMPLOYER = 'EMPLOYER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  skills?: string[];
  bio?: string;
  companyName?: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  postedAt: string;
  location: string;
  requirements: string[];
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedAt: string;
}
