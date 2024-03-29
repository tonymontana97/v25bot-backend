import { EUserRole } from '../../user/models/user-role.enum';
import { ReflectMetadata } from '@nestjs/common';

export const Roles = (...roles: EUserRole[]) => ReflectMetadata('roles', roles);
