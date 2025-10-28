export interface LoginRequest {
    email: string;
    password: string
}

export interface UserDto {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}