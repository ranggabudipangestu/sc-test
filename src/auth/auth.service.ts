import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {

    constructor(
    @Inject(forwardRef(() => UserService))
    private userService:UserService,
    private jwtService:JwtService){}

    async login(loginDto:LoginDto):Promise<{ accessToken }>{
        const userdata = await this.userService.validateUserPassword(loginDto)
        if(!userdata){
            throw new UnauthorizedException("invalid Username or password")
        }
        const payload = userdata 
        
        const accessToken = await this.jwtService.sign(payload)
        return { accessToken }
    }
    
}
