export interface PermissionOption {
  id: string;
  key: string;
  module: string;
  action: string;
  description: string | null;
}

export interface StaffRoleOption {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  permissionIds: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended';
  roleIds: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface StaffDirectory {
  staff: StaffMember[];
  roles: StaffRoleOption[];
  permissions: PermissionOption[];
  canCreateStaff: boolean;
  canEditStaff: boolean;
  canManageRoles: boolean;
  canManagePermissions: boolean;
  isSuperAdmin: boolean;
}
