import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    
    @Post("/login")
    signIn(@Body() loginDto:LoginDto):Promise<{accessToken}>{
        return this.authService.login(loginDto)
    }
}
