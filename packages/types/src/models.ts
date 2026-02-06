/**
 * Base model with common fields
 */
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User model
 */
export interface User extends BaseModel {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * User profile with additional data
 */
export interface UserProfile extends BaseModel {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  preferences: UserPreferences;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
}
