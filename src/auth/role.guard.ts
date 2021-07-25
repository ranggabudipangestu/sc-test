import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';
import { UserRole } from 'src/user/user.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const user:User = req.user
    if(user.role.toLocaleLowerCase() !== UserRole.ADMIN.toLocaleLowerCase()){
        throw new UnauthorizedException(`role '${user.role}' doesn't have access to this operation`)
    }
    
    return true
  }
}