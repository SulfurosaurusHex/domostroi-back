import { Role } from '@prisma/client';

export interface RequestWithId extends Request {
  userId: string;
  familyId: string;
  payed: boolean;
  role: Role;
}
