import { EUserRole } from '../../user/models/user-role.enum';

export interface IjwtPayload {
  username: string;
  id: string;
  role: EUserRole;
  iat?: Date;
}
