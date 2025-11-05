export interface UserSummaryDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}


export interface AddressDto {
  city: string;
  district: string;
  street: string;
}

export interface ProfileDto {
  fullName: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  address: AddressDto;
  bio: string;
}

export interface UserDto {
  id: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  profile: ProfileDto;
  companyId: string | null;
  company: any | null; 
}

export interface UserSummaryDto {
  id: string;
  fullName: string; 
  email: string;
  role: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
}