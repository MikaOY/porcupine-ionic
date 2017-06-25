import { DbCompatible } from '../interfaces/db-compatible.interface'; 
 
export class User implements DbCompatible { 
  constructor(public DbId: number, 
                public FirstName: string, 
                public LastName: string, 
                public Username: string, 
                public Email: string, 
                public PasswordHash?: string) { } 
}