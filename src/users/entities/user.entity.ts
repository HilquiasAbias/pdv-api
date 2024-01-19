import { user } from "@prisma/client";

export class UserEntity implements user {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  role_id: number;
  created_at: Date;
  updated_at: Date;
}
