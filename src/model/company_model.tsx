export interface CompanyLocationDto {
  address: string;
  city: string;
  district: string;
  country?: string | null;
}

export interface UserCompanyDto {
  id: string;
  email: string;
  fullName: string;
  phone: string;
}


export interface PendingCompanyDto {
  id: string;
  name: string;
  website: string;
  email: string;
  phone: string;
  businessField: string;
  taxCode: string;
  logoUrl: string;
  createdAt: string; 
  requestedBy: UserCompanyDto;
}

export interface CompanyVerificationRequest {
  companyId: string;
  approve: boolean;
  rejectionReason?: string | null;
}

export interface CompanyDetailDto {
  id: string;
  name: string;
  slug: string;
  website: string;
  email: string;
  phone: string;
  employeeSize: string;
  businessField: string;
  taxCode: string;
  foundedYear: number;
  introduction: string;
  vision: string;
  mission: string;
  coreValues: string[];
  location: CompanyLocationDto | null;
  tier: string;
  verified: boolean;
  verifiedAt: string | null;
  isActive: boolean;
  logoUrl: string;
  coverUrl: string;
  images: string[];
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCompanyRequest {
  name?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  employeeSize?: string | null;
  businessField?: string | null;
  taxCode?: string | null;
  foundedYear?: number | null;
  introduction?: string | null;
  vision?: string | null;
  mission?: string | null;
  coreValues?: string[] | null;
  location?: CompanyLocationDto | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  images?: string[] | null;
  benefits?: string[] | null;
}