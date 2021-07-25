import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const hasRoles = (...hasRoles: string[]) => SetMetadata(ROLES_KEY, hasRoles);