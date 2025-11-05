export interface CompanySnapshotDto {
  name: string;
  logoUrl: string;
  tier: string;
}

export interface SalaryDto {
  min: number;
  max: number;
  currency: string;
  type: string;
}

export interface WorkplaceDto {
  address: string;
  city: string;
  district: string;
}

export interface JobDto {
  id: string;
  title: string;
  companySnapshot: CompanySnapshotDto;
  salary: SalaryDto;
  experience: string;
  education: string;
  employmentType: string;
  workMode: string;
  skills: string[];
  categories: string[];
  jobDetails: string;
  requirements: string;
  benefits: string;
  workplace: WorkplaceDto;
  status: string;
  views: number;
  applicationCount: number;
  createdAt: string;
  endDate: string;
}

export interface CreateJobRequest {
  title: string;
  salary: SalaryDto;
  experience: string;
  education: string;
  employmentType: string;
  workMode: string;
  skills: string[];
  categories: string[];
  jobDetails: string;
  requirements: string;
  benefits: string;
  workplace: WorkplaceDto;
  vacancies: number;
  startDate: string;
  endDate: string;
}

export interface UpdateJobRequest {
  title?: string;
  salary?: SalaryDto;
  experience?: string;
  education?: string;
  employmentType?: string;
  workMode?: string;
  skills?: string[];
  categories?: string[];
  jobDetails?: string;
  requirements?: string;
  benefits?: string;
  workplace?: WorkplaceDto;
  vacancies?: number;
  startDate?: string;
  endDate?: string;
}

export interface ApplicantSnapshotDto {
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  resumeUrl: string | null;
  currentPosition: string | null;
  yearsOfExperience: number;
}

export interface AttachmentDto {
  type: string;
  url: string;
  name: string;
  size: number;
}

export interface StatusHistoryDto {
  status: string;
  changedAt: string;
  changedBy: string | null;
  note: string;
}

export interface ScreeningDto {
  score: number;
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
}

export interface ApplicantDto {
  id: string;
  jobId: string;
  applicantId: string;
  applicantSnapshot: ApplicantSnapshotDto;
  coverLetter: string;
  attachments: AttachmentDto[];
  status: string;
  statusHistory: StatusHistoryDto[];
  screening: ScreeningDto;
  interviews: any[];
  appliedAt: string;
  viewedByRecruiterAt: string | null;
  updatedAt: string;
}

export interface JobDetailDto {
  id: string;
  companyId: string;
  companySnapshot: CompanySnapshotDto;
  title: string;
  salary: SalaryDto;
  experience: string;
  education: string;
  employmentType: string;
  gender: string | null;
  ageRange: { min: number; max: number } | null;
  startDate: string;
  endDate: string;
  vacancies: number;
  workMode: string;
  skills: string[];
  categories: string[];
  keywords: string[] | null;
  jobDetails: string;
  requirements: string;
  benefits: string;
  workplace: WorkplaceDto;
  status: string;
  priority: string;
  isActive: boolean;
  views: number;
  applicationCount: number;
  rejectedCount: number;
  interviewedCount: number;
  hiredCount: number;
  lastActivityAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  schemaVersion: string;
  applicants: ApplicantDto[];
}