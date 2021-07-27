import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe  } from '@nestjs/common';
import { AdminGuard} from 'src/auth/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserData } from './get-user.decorator';
import { ChangePasswordDto, UpdateUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post('/user')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto:UserDto):Promise<User>{
        return this.userService.createUser(createUserDto)
    }

    
    @Get('/user')
    @UseGuards(JwtAuthGuard)
    getUserMany(@GetUserData() user:any):Promise<User[]>{
        return this.userService.getManyUser(user)
    }

    @Get("/user/:id")
    @UseGuards(JwtAuthGuard, AdminGuard)
    getUserById(@Param('id') id:any):Promise<User>{
        return this.userService.getUserById(id)
    }

    @Put("/user/:id")
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard, AdminGuard)
    updateUser(@Body() updateUserDto:UpdateUserDto, @Param('id') id:any):Promise<User>{
        return this.userService.updateUser(updateUserDto, id)
    }

    @Patch("/user/:id/change-password")
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard, AdminGuard)
    changePassword(@Body() changePassword:ChangePasswordDto, @Param('id') id:any):Promise<User>{
        return this.userService.changePassword(changePassword, id)
    }


    @Delete("/user/:id")
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteUser(@Param('id') id:any):Promise<any>{
        return this.userService.deleteUser(id)
    }
}
