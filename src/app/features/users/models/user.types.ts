export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
}
