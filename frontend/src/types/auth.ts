// Authentication and user-related type definitions

import { Role } from './enums';

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Auth response
export interface AuthResponse {
  token: string;
  user: User;
}

// User profile
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Update profile request
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
