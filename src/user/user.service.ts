import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChangePasswordDto, UpdateUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
import * as bcrypt from "bcryptjs";
import { LoginDto } from '../auth/login.dto';
import { UserRole } from './user.enum';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) 
    private userRepository:Repository<User>){
        this.seedData()
    }

    async createUser(createUser:UserDto):Promise<User>{

        const salt =  await bcrypt.genSalt(); //generate salt. unique per user
        const {username, password, email, role} = createUser
        const user  = new User()
        user.username = username
        user.password = await this.hashPassword(password,salt)
        user.salt = salt
        user.email = email
        user.role = role
        try{
            return await user.save()
        }catch(err){
            if(err.code === "ER_DUP_ENTRY"){ //if username/email is exist
                throw new ConflictException('Username/email already exist')
            }else{
                throw new InternalServerErrorException()
            }
        }
    }

    async getManyUser(user):Promise<User[]>{
        const data = user.role.toLocaleLowerCase() === UserRole.ADMIN.toLocaleLowerCase() ? await this.userRepository.find() : this.userRepository.find({id:user.id})
        if(!data){
            throw new NotFoundException("data was not found")
        }
        return data
    }

    async getUserById(id:any):Promise<User>{
        const data = await this.userRepository.findOne({id})
        if(!data){
            throw new NotFoundException(`user with id ${id} was not found`)
        }
        return data
    }

    async updateUser(updateUserDto:UpdateUserDto, id:number):Promise<User>{

        const user = await this.getUserById(id)

        const salt = user.salt
        user.username = updateUserDto.username;
        user.email = updateUserDto.email
        user.role = updateUserDto.role

        try{
            return await user.save()
        }catch(err){
            if(err.code === "ER_DUP_ENTRY"){ //if username/email is exist
                throw new ConflictException('Username/email already exist')
            }else{
                throw new InternalServerErrorException()
            }
        }
    }
    async changePassword(changeUserDto:ChangePasswordDto, id:number):Promise<any>{
        const user = await this.getUserById(id)
        const {oldPassword, newPassword, confirmNewPassword} = changeUserDto
        const salt = user.salt
        if(user.password !== await this.hashPassword(oldPassword, salt)){
            throw new BadRequestException("Old password is not valid")
        }
        if(newPassword !== confirmNewPassword){
            throw new BadRequestException("new password doesn't match")
        }
        user.password = await this.hashPassword(newPassword, salt)
        return await user.save()
    }
    async deleteUser(id:any):Promise<any>{
        const user = await this.getUserById(id)
        if(user){
            return await this.userRepository
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("id = :id", { id })
            .execute();
        }
        
    }

    private async hashPassword(password:string, salt:string):Promise<string>{
        return bcrypt.hash(password, salt)
    }

    async validateUserPassword(loginDto : LoginDto):Promise<any>{
        const {username, password} = loginDto
        const user = await this.userRepository.findOne({username}) //checking username
        
        if(user && await user.validatePassword(password)){
            return {id:user.id, username, role:user.role}
        }else{
            return null
        }
    }

    async seedData():Promise<any>{
        
        const admin = await this.userRepository.find({username:"admin"})
        if(admin.length === 0){
            await this.createUser({username:"admin", password:"admin@2021", email:"admin@gmail.com", role:UserRole.ADMIN})
        }

        const user = await this.userRepository.find({username:"user"})
        if(user.length === 0){
            this.createUser({username:"user", password:"user@2021", email:"user@gmail.com", role:UserRole.USER})
        }
    }
}
