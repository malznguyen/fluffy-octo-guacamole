// Main API barrel export
// Centralized API layer - import everything from @/lib/api

// Client
export { default as apiClient } from './client';

// Public APIs (no auth required)
export * from './public';

// Auth APIs
export * from './auth';

// Cart APIs
export * from './cart';

// Order APIs
export * from './order';

// Wishlist APIs
export * from './wishlist';

// Admin APIs (namespace as 'admin')
export * as admin from './admin';
