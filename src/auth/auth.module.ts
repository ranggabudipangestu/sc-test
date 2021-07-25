import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { AdminGuard } from './role.guard';

@Module({
  imports:[
    forwardRef(()=>UserModule) ,
    JwtModule.registerAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: async (configService:ConfigService)=>{
          return{
              secret:configService.get("JWT_SECRET"), 
              signOptions:{
              expiresIn:configService.get("JWT_EXPIRES"),
              algorithm:"HS256"
              }
          }
        }
    }),
  PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminGuard],
  exports:[JwtStrategy, PassportModule]
})
export class AuthModule {}
