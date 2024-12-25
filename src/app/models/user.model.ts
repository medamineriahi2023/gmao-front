export type UserRole = 'technician' | 'maintenance_chief' | 'store_manager' | 'purchase_manager';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: UserRole;
}
