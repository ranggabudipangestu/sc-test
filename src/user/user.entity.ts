import { Entity, Unique, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UserRole } from "./user.enum";

@Entity()
@Unique(["username", "email"])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    email:string
    
    @Column()
    username:string

    @Column()
    password:string

    @Column()
    salt:string

    @Column({type:'enum', enum:UserRole, default:UserRole.USER})
    role:UserRole

    

    async validatePassword(password:string):Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.password
    }


}
