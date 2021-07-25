import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "./jwt-payload.interface";
import { ExtractJwt, Strategy } from "passport-jwt";
import { forwardRef, Inject, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
//this class is use to validate the user authorization
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService:UserService
    ){
        
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }
    //validate is a fix method who need to validation the authorization
    async validate(payload:JwtPayload){
        const {username} = payload
        const user = await this.userService.getUserById({username})
        if(!user){
            throw new UnauthorizedException()
        }
        return {id:payload.id, username:payload.username, role:payload.role}
    }
}