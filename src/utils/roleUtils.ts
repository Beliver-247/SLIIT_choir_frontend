/**
 * Role-based utility functions
 */

export type UserRole = 'member' | 'moderator' | 'admin';

export interface MemberData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  role: UserRole;
  [key: string]: any;
}

/**
 * Get the current user's member data from localStorage
 */
export const getCurrentMember = (): MemberData | null => {
  try {
    const memberJson = localStorage.getItem('member');
    if (!memberJson) return null;
    return JSON.parse(memberJson) as MemberData;
  } catch (error) {
    console.error('Failed to parse member data:', error);
    return null;
  }
};

/**
 * Get the current user's role
 */
export const getCurrentUserRole = (): UserRole | null => {
  const member = getCurrentMember();
  return member?.role || null;
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const userRole = getCurrentUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  return userRole === role;
};

/**
 * Check if the current user can create events (admin or moderator)
 */
export const canCreateEvents = (): boolean => {
  return hasRole(['admin', 'moderator']);
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Check if the current user is a moderator
 */
export const isModerator = (): boolean => {
  return hasRole('moderator');
};

/**
 * Check if the current user can create practice schedules (admin or moderator)
 */
export const canCreateSchedules = (): boolean => {
  return hasRole(['admin', 'moderator']);
};
