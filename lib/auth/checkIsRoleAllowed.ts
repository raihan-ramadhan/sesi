import { Role } from '@/types/auth';

export const checkIsRoleAllowed = ({
  userRole,
  roleComponent,
}: {
  userRole: Role;
  roleComponent: Role;
}) => {
  const roleLevel = { USER: 1, ADMIN: 2, OWNER: 3 };

  return roleLevel[userRole] >= roleLevel[roleComponent];
};
