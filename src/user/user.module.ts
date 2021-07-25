import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports:[
        AuthModule,
        TypeOrmModule.forFeature([User])
    ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
