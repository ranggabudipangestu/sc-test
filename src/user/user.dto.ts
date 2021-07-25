import { IsEmail, IsNotEmpty } from "class-validator"
import { UserRole } from "./user.enum"

export class UserDto{
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    password:string

    @IsNotEmpty()
    role:UserRole
    
}